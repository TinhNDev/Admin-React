import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const get_allDriver = createAsyncThunk(
  "admin/get_allDriver",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
      }

      const { data } = await api.get("/admin/driver", {
        params: { parPage, page, search: searchValue },
        headers: {
          Authorization: token,
          "x-client-id": adminId,
        },
      });

      return fulfillWithValue(data.metadata);
    } catch (error) {
      console.error("Lỗi API:", error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Không thể kết nối đến server."
      );
    }
  }
);

export const get_driver = createAsyncThunk(
  "admin/get_driver",
  async (shipperID, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      console.log("shipperID ID:", shipperID);
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
      }

      const { data } = await api.get(`/admin/${shipperID}/driver`, {
        headers: {
          Authorization: token,
          "x-client-id": adminId,
        },
      });

      console.log("API Response:", data); // Debug API response
      return fulfillWithValue(data.metadata); // Lấy đúng `metadata`
    } catch (error) {
      console.error("Lỗi API:", error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Không thể kết nối đến server."
      );
    }
  }
);

//Change status shipper
export const change_shipper_status = createAsyncThunk(
  "admin/change_shipper_status",
  async (
    { driverId, status },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        throw new Error("Thiếu thông tin xác thực (token hoặc adminId).");
      }

      // Gửi yêu cầu API với driverId và status
      const { data } = await api.put(
        `/admin/driver/${driverId}`,
        { status }, // Thêm status vào body của request
        {
          headers: {
            Authorization: token,
            "x-client-id": adminId,
          },
        }
      );

      return fulfillWithValue(data.metadata); // Metadata từ API
    } catch (error) {
      console.error("❌ Lỗi API:", error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message ||
          "Lỗi từ server (500). Kiểm tra lại API."
      );
    }
  }
);
export const get_shipper_orders = createAsyncThunk(
  "admin/get_shipper_orders",
  async (shipperId, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
      }
      const { data } = await api.get(`/driver/${shipperId}/order`, {
        headers: {
          Authorization: token,
          "x-client-id": adminId,
        },
      });
      console.log("API Response:", data.metadata); // Debug API response

      return fulfillWithValue(data.metadata);
    } catch (error) {
      console.error("Lỗi API:", error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message ||
          "Không thể lấy danh sách đơn hàng của shipper."
      );
    }
  }
);
export const get_driver_reviews = createAsyncThunk(
  "admin/get_driver_reviews",
  async (shipperId, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

      if (!token || !adminId) {
        return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
      }

      const { data } = await api.get(`/review/${shipperId}/driver`, {
        headers: {
          Authorization: token,
          "x-client-id": adminId,
        },
      });
      console.log("API Response:", data.metadata); // Debug API response
      return fulfillWithValue(data.metadata);
    } catch (error) {
      console.error("Lỗi API:", error?.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy đánh giá của shipper."
      );
    }
  }
);

// Driver Reducer
const driverReducer = createSlice({
  name: "driver",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    drivers: [],
    orders: [],
    reviews: [],
    totalReviews: 0,
    driver: null,
    totalDrivers: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(get_allDriver.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_allDriver.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.drivers = payload;
        state.totalDrivers = payload.length;
      })
      .addCase(get_allDriver.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload || "Không thể lấy danh sách driver.";
      })
      .addCase(get_driver.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_driver.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.driver = payload;
      })
      .addCase(get_driver.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload || "Không thể lấy driver.";
      })
      .addCase(change_shipper_status.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(change_shipper_status.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.driver = payload;
      })
      .addCase(change_shipper_status.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage =
          payload || "Không thể cập nhật trạng thái shipper.";
      })
      //get order by shipper
      .addCase(get_shipper_orders.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_shipper_orders.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.orders = payload;
      })
      .addCase(get_shipper_orders.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload;
      })
      //get reviews by shipper
      .addCase(get_driver_reviews.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_driver_reviews.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.reviews = payload;
        state.totalReviews = payload.length;
      })
      .addCase(get_driver_reviews.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload;
        state.reviews = [];
        state.totalReviews = 0;
      });
  },
});

export const { messageClear } = driverReducer.actions;
export default driverReducer.reducer;
