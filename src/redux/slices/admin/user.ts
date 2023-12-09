import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { UserManager } from '../../../@types/admin-user';

// ----------------------------------------------------------------------

type UserState = {
  isLoading: boolean;
  error: boolean;
  userList: UserManager[];
};

const initialState: UserState = {
  isLoading: false,
  error: false,
  userList: []
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET MANAGE USERS
    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUserList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Account/get-all');
      dispatch(slice.actions.getUserListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteUserApi(userId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/Account/delete-Account', {
        params: {
          dto: userId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Account/get-all');
        dispatch(slice.actions.getUserListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateUser(data: Partial<UserManager> = {}, isUnbannedUser: boolean) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Account/update-Account', {
        ...data,
        ...(isUnbannedUser && { status: true })
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Account/get-all');
        dispatch(slice.actions.getUserListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
