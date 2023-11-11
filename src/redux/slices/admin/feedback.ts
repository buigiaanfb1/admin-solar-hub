import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { FeedbackManager } from '../../../@types/feedback';

// ----------------------------------------------------------------------

type FeedbackState = {
  isLoading: boolean;
  error: boolean;
  feedbackList: FeedbackManager[];
};

const initialState: FeedbackState = {
  isLoading: false,
  error: false,
  feedbackList: []
};

const slice = createSlice({
  name: 'feedback',
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
    getFeedbackListSuccess(state, action) {
      state.isLoading = false;
      state.feedbackList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getFeedbackList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Feedback/get-feedback');
      dispatch(slice.actions.getFeedbackListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteFeedbackApi(feedbackId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/Feedback/delete-feedback', {
        params: {
          dto: feedbackId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Feedback/get-feedback');
        dispatch(slice.actions.getFeedbackListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
