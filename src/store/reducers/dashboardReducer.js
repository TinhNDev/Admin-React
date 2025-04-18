import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const get_admin_dashboard_data = createAsyncThunk(
  'dashboard/get_admin_dashboard_data',
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
    const token = localStorage.getItem("userToken");
    const adminId = getState().auth.userInfo?.user_id || localStorage.getItem("adminId");
    if (!token || !adminId) {
        return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
    }
    const { data } = await api.get("/admin/get-dashboard-data", {
        headers: {
            Authorization: token,
            "x-client-id": adminId,
        },
    });
      return fulfillWithValue(data.metadata); 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const dashboardReducer = createSlice({
  name: 'dashboard',
  initialState: {
    totalProduct: 0,
    totalSeller: 0,
    totalShipper: 0
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
        if (payload) {
          state.totalProduct = payload.totalProduct ;
          state.totalShipper = payload.totalShipper ;
          state.totalSeller = payload.totalSeller ;
        }
      });
  }
});

export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;
