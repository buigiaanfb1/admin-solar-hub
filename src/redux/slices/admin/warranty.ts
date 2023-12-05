import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { WarrantyManager } from '../../../@types/warranty';

// ----------------------------------------------------------------------

type WarrantyState = {
  isLoading: boolean;
  error: boolean;
  warrantyList: WarrantyManager[];
};

const initialState: WarrantyState = {
  isLoading: false,
  error: false,
  warrantyList: []
};

const slice = createSlice({
  name: 'warranty',
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
    getWarrantyListSuccess(state, action) {
      state.isLoading = false;
      state.warrantyList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getWarrantyList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/WarrantyReport/get-warranty-admin');
      dispatch(slice.actions.getWarrantyListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteWarrantyApi(warrantyId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/WarrantyReport/delete-warranty', {
        params: {
          dto: warrantyId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/WarrantyReport/get-warranty-admin');
        dispatch(slice.actions.getWarrantyListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateWarranty(data: Partial<WarrantyManager> = {}, status: boolean = false) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Warranty/Update-warranty-by-id', {
        ...data,
        status
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Warranty/get-all-warranty');
        dispatch(slice.actions.getWarrantyListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
