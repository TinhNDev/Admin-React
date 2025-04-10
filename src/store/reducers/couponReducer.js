import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";

//Create coupon

export const create_coupon = createAsyncThunk(
    "admin/create_coupon",
    async ({ body }, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const token = localStorage.getItem("userToken");
            const adminId = getState().auth.userInfo?.user_id || localStorage.getItem("adminId");
  
            if (!token || !adminId) {
                throw new Error("Thiếu thông tin xác thực (token hoặc adminId).");
            }
  
          
            const { data } = await api.post(
                `/coupon`,
                body, // Pass the body object directly
                {
                    headers: {
                        Authorization: token,
                        "x-client-id": adminId,
                    },
                }
            );
  
            return fulfillWithValue(data.metadata); 
        } catch (error) {
            console.error("❌ Lỗi API:", error?.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Lỗi từ server (500). Kiểm tra lại API.");
        }
    }
  );
  const couponSlice = createSlice({
    name: 'coupon',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        coupons: [],
        coupon: '',
        totalProduct: 0,
        statusCode: null
    },
    reducers: {
        messageClear: (state) => {
            state.successMessage = '';
            state.errorMessage = '';
            state.statusCode = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(create_coupon.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
                state.successMessage = '';
                state.statusCode = null;
            })
            .addCase(create_coupon.rejected, (state, action) => {
                state.loader = false;
                
                if (typeof action.payload === 'object') {
                    state.errorMessage = action.payload.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
                    state.statusCode = action.payload.statusCode || null;
                } else {
                    state.errorMessage = action.payload || 'Đã xảy ra lỗi. Vui lòng thử lại.';
                }
            })
            .addCase(create_coupon.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.message || 'Thêm mã giảm thành công';
                state.statusCode = 200;
            });
    }
});

export const { messageClear } = couponSlice.actions;
export default couponSlice.reducer;