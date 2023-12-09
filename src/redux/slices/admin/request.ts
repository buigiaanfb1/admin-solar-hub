import { createSlice } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { RequestManager } from '../../../@types/request';
import { getUserList } from './user';

// ----------------------------------------------------------------------

type RequestState = {
  isLoading: boolean;
  error: boolean;
  requestList: RequestManager[];
};

const initialState: RequestState = {
  isLoading: false,
  error: false,
  requestList: []
};

const slice = createSlice({
  name: 'request',
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
    getRequestListSuccess(state, action) {
      state.isLoading = false;
      state.requestList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getRequestList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Request/get-request');
      dispatch(slice.actions.getRequestListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateRequest(data: Partial<RequestManager> = {}) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Request/assign-staff', {
        ...data
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Request/get-request');
        batch(() => {
          dispatch(slice.actions.getRequestListSuccess(response.data.data));
          dispatch(getUserList());
          dispatch(getRequestList());
        });
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        throw Error();
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw Error();
    }
  };
}
