import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { ConstructionContractManager } from '../../../@types/contract';

// ----------------------------------------------------------------------

type ConstructionContractState = {
  isLoading: boolean;
  error: boolean;
  constructionContractList: ConstructionContractManager[];
};

const initialState: ConstructionContractState = {
  isLoading: false,
  error: false,
  constructionContractList: []
};

const slice = createSlice({
  name: 'ConstructionContract',
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
    getConstructionContractListSuccess(state, action) {
      state.isLoading = false;
      state.constructionContractList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getContractList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/ConstructionContract/get-all-Construction-Contract`);
      dispatch(slice.actions.getConstructionContractListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteContractApi(constructionContractId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(
        `/api/ConstructionContract/Delete-Construction-contract?constructionContractId=${constructionContractId}`
      );
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get(`/api/ConstructionContract/get-all-Construction-Contract`);
        dispatch(slice.actions.getConstructionContractListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function enableContractApi(constructionContractId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(
        `/api/ConstructionContract/Update-construction-contract-with-id`,
        {
          constructionContractId,
          status: '1'
        }
      );
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get(`/api/ConstructionContract/get-all-Construction-Contract`);
        dispatch(slice.actions.getConstructionContractListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getContractListByStaff(staffId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `/api/ConstructionContract/get-Construction-Contract-by-staffid?staffId=${staffId}`
      );
      dispatch(slice.actions.getConstructionContractListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function rejectContractApi(constructionContractId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/ConstructionContract/Update-contruction-contract-with-id', {
        constructionContractId,
        isConfirmed: false
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get(`/api/ConstructionContract/get-all-Construction-Contract`);
        dispatch(slice.actions.getConstructionContractListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function confirmContract(constructionContractId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/ConstructionContract/Update-contruction-contract-with-id', {
        constructionContractId,
        isConfirmed: true
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get(`/api/ConstructionContract/get-all-Construction-Contract`);
        dispatch(slice.actions.getConstructionContractListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
