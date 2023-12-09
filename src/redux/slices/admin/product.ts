import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { ProductManager } from '../../../@types/product';

// ----------------------------------------------------------------------

type ProductState = {
  isLoading: boolean;
  error: boolean;
  productList: ProductManager[];
};

const initialState: ProductState = {
  isLoading: false,
  error: false,
  productList: []
};

const slice = createSlice({
  name: 'product',
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
    getProductListSuccess(state, action) {
      state.isLoading = false;
      state.productList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProductList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Product/get-Product-admin');
      dispatch(slice.actions.getProductListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteProductApi(productId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/Product/delete-product', {
        params: {
          productId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Product/get-Product-admin');
        dispatch(slice.actions.getProductListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateProduct(data: Partial<ProductManager> = {}, status: boolean = false) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Product/update-Product', {
        ...data,
        status
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Product/get-Product-admin');
        dispatch(slice.actions.getProductListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
