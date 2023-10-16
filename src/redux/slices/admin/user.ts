import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axios';
import { UserManager } from '../../../@types/user';

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

    // DELETE USERS
    deleteUser(state, action) {
      const deleteUser = filter(state.userList, (user) => user.id !== action.payload);
      state.userList = deleteUser;
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

// Actions
export const { deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function getUserList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Token/Login_username_password');
      dispatch(slice.actions.getUserListSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
