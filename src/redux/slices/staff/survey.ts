import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { SurveyManager } from '../../../@types/survey';

// ----------------------------------------------------------------------

type SurveyState = {
  isLoading: boolean;
  error: boolean;
  surveyList: SurveyManager[];
};

const initialState: SurveyState = {
  isLoading: false,
  error: false,
  surveyList: []
};

const slice = createSlice({
  name: 'survey',
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
    getSurveyListSuccess(state, action) {
      state.isLoading = false;
      state.surveyList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getSurveyList(staffId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/Survey/Get-survey-staffid?staffId=${staffId}`);
      dispatch(slice.actions.getSurveyListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteSurveyApi(surveyId: string, staffId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/Survey/Delete-survey-by-id', {
        params: {
          surveyId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get(`/api/Survey/get-survey-staffid?staffId=${staffId}`);
        dispatch(slice.actions.getSurveyListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateSurvey(data: Partial<SurveyManager> = {}, staffId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Survey/Update-survey-by-id', {
        ...data
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get(`/api/Survey/get-survey-staffid?staffId=${staffId}`);
        dispatch(slice.actions.getSurveyListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
