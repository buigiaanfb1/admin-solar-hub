import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { RequestManager } from '../../../@types/request';

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
  name: 'staffRequest',
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

export function getRequestList(staffId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/Request/get-request-staff?StaffId=${staffId}`);
      dispatch(slice.actions.getRequestListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function disableRequest(requestId: string, staffId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/api/Request/disable-request?requestId=${requestId}`);
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get(`/api/Request/get-request-staff?StaffId=${staffId}`);
        dispatch(slice.actions.getRequestListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
