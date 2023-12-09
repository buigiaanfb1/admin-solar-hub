import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { PromotionManager } from '../../../@types/promotion';

// ----------------------------------------------------------------------

type PromotionState = {
  isLoading: boolean;
  error: boolean;
  promotionList: PromotionManager[];
};

const initialState: PromotionState = {
  isLoading: false,
  error: false,
  promotionList: []
};

const slice = createSlice({
  name: 'promotion',
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
    getPromotionListSuccess(state, action) {
      state.isLoading = false;
      state.promotionList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getPromotionList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Promotion/getall-promotion');
      dispatch(slice.actions.getPromotionListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deletePromotionApi(promotionId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/Promotion/Delete-promotion', {
        params: {
          promotionId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Promotion/getall-promotion');
        dispatch(slice.actions.getPromotionListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updatePromotion(data: Partial<PromotionManager> = {}) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Promotion/Update-promotion-by-id', {
        ...data,
        status: true
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Promotion/getall-promotion');
        dispatch(slice.actions.getPromotionListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
