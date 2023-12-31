/* eslint-disable import/no-duplicates */
import { createContext, ReactNode, useEffect, useReducer, useState, useRef } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
// utils
import axios from 'utils/axiosIntegrated';
import { useSnackbar } from 'notistack5';

// @types
import { ActionMap, AuthState, AuthUser, FirebaseContextType } from '../@types/authentication';
import { firebaseConfig } from '../config';
import { defaultState } from './defaultState';

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
  const count = useRef(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user && user.email) {
          try {
            // Fake login when logging with Google Provider
            const response = await axios.post('/api/Token/Login_username_password', {
              username: user.email.split('@')[0],
              password: 'default'
            });

            if (
              response.data.user.roleId === '4' ||
              !response.data.user.status
              // (response.data.user.roleId === '3' && !response.data.user.isLeader)
            ) {
              throw new Error();
            } else {
              localStorage.removeItem('credential');
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
        } else if (localStorage.getItem('credential')) {
          const credential = JSON.parse(localStorage.getItem('credential') || '');
          login(credential?.username, credential?.password);
        } else if (!state.user) {
          dispatch({
            type: Types.Initial,
            payload: { isAuthenticated: false, user: null }
          });
        }
        count.current += 1;
      }),
    [dispatch]
  );

  const login = async (username: string, password: string) => {
    try {
      // Fake login when logging with Google Provider
      const response = await axios.post('/api/Token/Login_username_password', {
        username,
        password
      });

      if (
        response.data.user.role.roleId === '4' ||
        // (response.data.user.role.roleId === '3' && !response.data.user.isLeader) ||
        !response.data.user.status
      ) {
        throw new Error();
      } else {
        localStorage.setItem('credential', JSON.stringify({ username, password }));
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: true,
            user: { ...defaultState, userInfo: response.data.user }
          }
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
            displayName: `${lastName} ${firstName}`
          });
      });

  const logout = async () => {
    await firebase.auth().signOut();
    dispatch({
      type: Types.Initial,
      payload: { isAuthenticated: false, user: null }
    });
  };

  const resetPassword = async (email: string) => {
    await firebase.auth().sendPasswordResetEmail(email);
  };

  const uploadImages = async (files: (File | string)[]): Promise<string[]> => {
    if (!state.user) {
      throw new Error('User not authenticated');
    }

    // Create a reference to the Firebase storage bucket
    const storageRef = firebase.storage().ref();

    // Initialize an array to store the download URLs
    const downloadURLs: string[] = [];

    // Function to upload a single file
    const uploadFile = async (file: File) => {
      const fileName = `products/${state.user?.accountId || 'common'}/${Date.now()}_${file.name}`;
      const uploadTask = storageRef.child(fileName).put(file);
      await uploadTask;
      const downloadURL = await storageRef.child(fileName).getDownloadURL();
      downloadURLs.push(downloadURL);
    };

    // Upload all files in parallel
    await Promise.all(
      files.map((file) => {
        if (file instanceof File) {
          return uploadFile(file);
        }

        if (typeof file === 'string') {
          // If it's a string (URL), directly add it to the downloadURLs array
          downloadURLs.push(file);
        }

        // Always return a resolved promise to avoid the "consistent-return" error
        return Promise.resolve();
      })
    );

    return downloadURLs;
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
            `${auth.userInfo?.lastname} ${auth.userInfo?.firstname}`,
          role: auth.userInfo?.role.roleName || '',
          phoneNumber: auth.phoneNumber || profile?.phoneNumber || '',
          country: profile?.country || '',
          address: profile?.address || '',
          state: profile?.state || '',
          city: profile?.city || '',
          zipCode: profile?.zipCode || '',
          about: profile?.about || '',
          isPublic: profile?.isPublic || false,
          userInfo: auth.userInfo
        },
        login,
        register,
        loginWithGoogle,
        loginWithFaceBook,
        loginWithTwitter,
        logout,
        resetPassword,
        uploadImages,
        updateProfile: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
