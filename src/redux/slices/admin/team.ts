import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from '../../../utils/axiosIntegrated';
import { TeamManager } from '../../../@types/team';
import { UserManager } from '../../../@types/admin-user';

// ----------------------------------------------------------------------

type TeamState = {
  isLoading: boolean;
  error: boolean;
  teamList: TeamManager[];
  staffNotHaveTeamList: UserManager[];
};

const initialState: TeamState = {
  isLoading: false,
  error: false,
  teamList: [],
  staffNotHaveTeamList: []
};

const slice = createSlice({
  name: 'team',
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
    getTeamListSuccess(state, action) {
      state.isLoading = false;
      state.teamList = action.payload;
    },

    // GET MANAGE USERS
    getStaffNotHaveTeamListSuccess(state, action) {
      state.isLoading = false;
      state.staffNotHaveTeamList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getTeamList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Team/get-all');
      let { data } = response.data;
      // Ensure 'staff' within each element of 'data' is treated as an array
      data = data.map((item: TeamManager) => {
        let staffData = item.staff;

        // Check if staffData is not an array, convert it to an array
        if (!Array.isArray(staffData)) {
          staffData = staffData ? [staffData] : []; // Convert single object to an array or empty array if null/undefined
        }

        // Update the 'staff' property of the item with the modified staffData array
        return { ...item, staff: staffData };
      });

      // Update the response data with the modified 'data' array
      response.data.data = data;
      dispatch(slice.actions.getTeamListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getStaffNotHaveTeamList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/Team/get-staff-not-have-team');
      dispatch(slice.actions.getStaffNotHaveTeamListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteTeamApi(leaderId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete('/api/Team/delete', {
        params: {
          leadId: leaderId
        }
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Team/get-all');
        dispatch(slice.actions.getTeamListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        throw Error('');
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw Error('');
    }
  };
}

// ----------------------------------------------------------------------

export function updateTeam(data: Partial<TeamManager> = {}, status: boolean = false) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put('/api/Team/Update-team-by-id', {
        ...data,
        status
      });
      // TODO: need to refactor
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get('/api/Team/get-all');
        dispatch(slice.actions.getTeamListSuccess(response.data.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
