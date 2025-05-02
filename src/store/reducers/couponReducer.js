import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Create coupon
export const create_coupon = createAsyncThunk(
  "admin/create_coupon",
  async ({ body }, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        throw new Error("Thiếu thông tin xác thực (token hoặc adminId).");
      }

      const { data } = await api.post(
        `/coupon`,
        body,
        {
          headers: {
            Authorization: token,
            "x-client-id": adminId,
          },
        }
      );

      // Giả sử API trả về: { message, coupon }
      return fulfillWithValue(data.metadata);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Lỗi từ server (500). Kiểm tra lại API."
      );
    }
  }
);

// Get coupons
export const get_coupons = createAsyncThunk(
  "admin/get_coupons",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        throw new Error("Thiếu thông tin xác thực (token hoặc adminId).");
      }

      const { data } = await api.get(`/admin/coupon`, {
        headers: {
          Authorization: token,
          "x-client-id": adminId,
        },
      });
      // Giả sử API trả về: { metadata: [coupon, ...] }
      return fulfillWithValue(data.metadata);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Lỗi từ server (500). Kiểm tra lại API."
      );
    }
  }
);

// Edit coupon
export const edit_coupon = createAsyncThunk(
  "admin/edit_coupon",
  async ({ body }, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        throw new Error("Thiếu thông tin xác thực (token hoặc adminId).");
      }

      const { data } = await api.put(
        `/admin/coupon`,
        {
          coupon_id: body.id,
          ...body,
        },
        {
          headers: {
            Authorization: token,
            "x-client-id": adminId,
          },
        }
      );

      // Giả sử API trả về: { message, coupon }
      return fulfillWithValue(data.metadata);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Lỗi từ server (500). Kiểm tra lại API."
      );
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    coupons: [],
    coupon: null,
    totalCoupons: 0,
    statusCode: null,
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
      state.statusCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE COUPON
      .addCase(create_coupon.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
        state.statusCode = null;
      })
      .addCase(create_coupon.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage =
          action.payload || "Đã xảy ra lỗi. Vui lòng thử lại.";
        state.statusCode = null;
      })
      .addCase(create_coupon.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage =
          action.payload.message || "Thêm mã giảm giá thành công";
        state.statusCode = 200;
        // Thêm coupon mới vào đầu danh sách nếu API trả về coupon
        if (action.payload?.coupon) {
          state.coupons = [action.payload.coupon, ...state.coupons];
          state.totalCoupons = state.coupons.length;
        }
      })

      // GET COUPONS
      .addCase(get_coupons.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_coupons.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage =
          action.payload || "Lỗi khi tải danh sách mã giảm giá";
      })
      .addCase(get_coupons.fulfilled, (state, action) => {
        state.loader = false;
        state.coupons = action.payload || [];
        state.totalCoupons = state.coupons.length;
      })

      // EDIT COUPON
      .addCase(edit_coupon.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
        state.statusCode = null;
      })
      .addCase(edit_coupon.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage =
          action.payload || "Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.";
        state.statusCode = null;
      })
      .addCase(edit_coupon.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage =
          action.payload.message || "Cập nhật mã giảm giá thành công";
        state.statusCode = 200;
        // Update coupon trong danh sách nếu API trả về coupon
        if (action.payload?.coupon) {
          state.coupons = state.coupons.map((coupon) =>
            coupon.id === action.payload.coupon.id
              ? action.payload.coupon
              : coupon
          );
        }
      });
  },
});

export const { messageClear } = couponSlice.actions;
export default couponSlice.reducer;
