import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { PaymentManager } from '../../../@types/admin-payment';

// ----------------------------------------------------------------------

type PaymentState = {
  isLoading: boolean;
  error: boolean;
  paymentList: PaymentManager[];
};

const initialState: PaymentState = {
  isLoading: false,
  error: false,
  paymentList: []
};

const slice = createSlice({
  name: 'payment',
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
    getPaymentListSuccess(state, action) {
      state.isLoading = false;
      state.paymentList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getPaymentList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Payment/get-payment');
      dispatch(slice.actions.getPaymentListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
