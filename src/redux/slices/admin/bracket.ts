import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { BracketManager } from '../../../@types/bracket';

// ----------------------------------------------------------------------

type BracketState = {
  isLoading: boolean;
  error: boolean;
  bracketList: BracketManager[];
};

const initialState: BracketState = {
  isLoading: false,
  error: false,
  bracketList: []
};

const slice = createSlice({
  name: 'bracket',
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
    getBracketListSuccess(state, action) {
      state.isLoading = false;
      state.bracketList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getBracketList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Bracket/get-all-bracket');
      dispatch(slice.actions.getBracketListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteBracketApi(bracketId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/Bracket/Delete-bracket', {
        params: {
          bracketId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Bracket/get-all-bracket');
        dispatch(slice.actions.getBracketListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateBracket(data: Partial<BracketManager> = {}, status: boolean = false) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Bracket/Update-bracket-by-id', {
        ...data,
        status
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Bracket/get-all-bracket');
        dispatch(slice.actions.getBracketListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
