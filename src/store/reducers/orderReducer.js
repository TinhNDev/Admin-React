import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Thunk action để lấy tất cả đơn hàng
export const get_allOrder = createAsyncThunk(
  "admin/get_allOrder",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
      }

      const { data } = await api.get("/admin/order", {
        headers: {
          Authorization: token,
          "x-client-id": adminId,
        },
      });

      // Trả về metadata (là một mảng)
      return fulfillWithValue(data.metadata);
    } catch (error) {
      console.error("❌ Lỗi API:", error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Không thể kết nối đến server."
      );
    }
  }
);
export const get_order_detail = createAsyncThunk(
  "order/get_detail",
  async (orderId, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
      }

      const { data } = await api.get(`/admin/order/${orderId}`, {
        headers: {
          Authorization: token,
          "x-client-id": adminId,
        },
      });

      return fulfillWithValue(data.metadata);
    } catch (error) {
      console.error("❌ Lỗi API:", error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy chi tiết đơn hàng."
      );
    }
  }
);
const orderReducer = createSlice({
  name: "order",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    orders: [], // Dữ liệu đơn hàng
    totalOrders: 0, // Tổng số đơn hàng
    orderDetail: null, // Chi tiết đơn hàng
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_allOrder.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_allOrder.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.orders = payload || []; // Gán mảng metadata vào orders
        state.totalOrders = payload.length || 0; // Tính tổng số đơn hàng dựa trên độ dài của mảng
      })
      .addCase(get_allOrder.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload || "Không thể lấy danh sách đơn hàng.";
      })

      .addCase(get_order_detail.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_order_detail.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.orderDetail = payload;
      })
      .addCase(get_order_detail.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload;
        state.orderDetail = null;
      });
  },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
