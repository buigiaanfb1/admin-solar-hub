import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { PackageManager } from '../../../@types/package';

// ----------------------------------------------------------------------

type PackageState = {
  isLoading: boolean;
  error: boolean;
  packageList: PackageManager[];
};

const initialState: PackageState = {
  isLoading: false,
  error: false,
  packageList: []
};

const slice = createSlice({
  name: 'package',
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
    getPackageListSuccess(state, action) {
      state.isLoading = false;
      state.packageList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getPackageListStaff() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Package/get-Package');
      dispatch(slice.actions.getPackageListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPackageList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Package/get-Package-admin');
      dispatch(slice.actions.getPackageListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deletePackageApi(packageId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/Package/delete-Package', {
        params: {
          packageId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Package/get-Package-admin');
        dispatch(slice.actions.getPackageListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updatePackage(data: Partial<PackageManager> = {}, status: boolean = false) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Package/update-Package', {
        ...data,
        status
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Package/get-Package-admin');
        dispatch(slice.actions.getPackageListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
