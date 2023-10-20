/* eslint-disable import/no-duplicates */
import { createContext, ReactNode, useEffect, useReducer, useState, useRef } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
// utils
import axios from 'utils/axiosIntegrated';
import { useSnackbar } from 'notistack5';

// @types
import { ActionMap, AuthState, AuthUser, FirebaseContextType } from '../@types/authentication';
import { firebaseConfig } from '../config';

// ----------------------------------------------------------------------

const ADMIN_EMAILS = ['demo@minimals.cc'];

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

enum Types {
  Initial = 'INITIALISE'
}

type FirebaseAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
};

type FirebaseActions = ActionMap<FirebaseAuthPayload>[keyof ActionMap<FirebaseAuthPayload>];

const reducer = (state: AuthState, action: FirebaseActions) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  }

  return state;
};

const AuthContext = createContext<FirebaseContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<firebase.firestore.DocumentData | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const count = useRef(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user && user.email && count.current > 0) {
          try {
            // Fake login when logging with Google Provider
            const response = await axios.post('/api/Token/Login_username_password', {
              username: user.email.split('@')[0],
              password: password || 'default'
            });

            if (response.data.user.role.roleId === '4') {
              throw new Error();
            } else {
              dispatch({
                type: Types.Initial,
                payload: { isAuthenticated: true, user: { ...user, userInfo: response.data.user } }
              });

              axios.interceptors.request.use(
                (config) => {
                  // Add the authorization token to the headers for all requests.
                  config.headers.Authorization = `Bearer ${response.data.token}`;
                  return config;
                },
                (error) => Promise.reject(error)
              );
            }
          } catch (error: any) {
            enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', { variant: 'error' });
            logout(); // Force logout if error. Cuz onAuthStateChanged() will not trigger again if user login again with the same credential.
            dispatch({
              type: Types.Initial,
              payload: { isAuthenticated: false, user: null }
            });
          }
        } else if (!state.user) {
          dispatch({
            type: Types.Initial,
            payload: { isAuthenticated: false, user: null }
          });
        }
        count.current += 1;
      }),
    [dispatch, password]
  );

  const login = (email: string, password: string) => {
    setPassword(password);
    const realEmail = `${email}@gmail.com`;
    return firebase.auth().signInWithEmailAndPassword(realEmail, password);
  };

  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const loginWithFaceBook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const loginWithTwitter = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const register = (email: string, password: string, firstName: string, lastName: string) =>
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .firestore()
          .collection('users')
          .doc(res.user?.uid)
          .set({
            uid: res.user?.uid,
            email,
            displayName: `${firstName} ${lastName}`
          });
      });

  const logout = async () => {
    await firebase.auth().signOut();
    setPassword(undefined);
  };

  const resetPassword = async (email: string) => {
    await firebase.auth().sendPasswordResetEmail(email);
  };

  const auth = { ...state.user };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: {
          id: auth.uid,
          email: auth.userInfo?.email,
          photoURL: auth.photoURL || profile?.photoURL,
          displayName:
            auth.displayName ||
            profile?.displayName ||
            `${auth.userInfo?.firstname} ${auth.userInfo?.lastname}`,
          role: auth.userInfo?.role.roleName || '',
          phoneNumber: auth.phoneNumber || profile?.phoneNumber || '',
          country: profile?.country || '',
          address: profile?.address || '',
          state: profile?.state || '',
          city: profile?.city || '',
          zipCode: profile?.zipCode || '',
          about: profile?.about || '',
          isPublic: profile?.isPublic || false
        },
        login,
        register,
        loginWithGoogle,
        loginWithFaceBook,
        loginWithTwitter,
        logout,
        resetPassword,
        updateProfile: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
