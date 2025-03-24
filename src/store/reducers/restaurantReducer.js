import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Lấy danh sách nhà hàng
export const get_allRestaurant = createAsyncThunk(
    "admin/get_allRestaurant",
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const token = localStorage.getItem("userToken");
            const adminId = getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

            if (!token || !adminId) {
                return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
            }

            const { data } = await api.get("/admin/restaurant", {
                params: { parPage, page, search: searchValue },
                headers: {
                    Authorization: token,
                    "x-client-id": adminId,
                },
            });

            return fulfillWithValue(data.metadata);
        } catch (error) {
            console.error("Lỗi API:", error?.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Không thể kết nối đến server.");
        }
    }
);

// Lấy chi tiết một nhà hàng
export const get_restaurant = createAsyncThunk(
    'admin/get_restaurant',
    async (resID, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/restaurant/${resID}/detail`);
        
            return fulfillWithValue(data.metadata); 
        } catch (error) {
            console.error("Lỗi API:", error?.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Không thể kết nối đến server.");
        }
    }
);
//Change status seller
export const change_seller_status = createAsyncThunk(
    "admin/change_seller_status",
    async ({ resID }, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const token = localStorage.getItem("userToken");
            const adminId = getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

            if (!token || !adminId) {
                throw new Error("Thiếu thông tin xác thực (token hoặc adminId).");
            }

            // Gửi yêu cầu API (chỉ với resID)
            const { data } = await api.put(
                `/admin/restaurant/${resID}`,
                {}, // Không gửi trạng thái
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
            return rejectWithValue(error.response?.data?.message || "Lỗi từ server (500). Kiểm tra lại API.");
        }
    }
);




// Restaurant Reducer
const restaurantReducer = createSlice({
    name: "restaurant",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        restaurants: [],
        restaurant: null, // Lưu chi tiết một nhà hàng
        totalRestaurant: 0,
    },
    reducers: {
        messageClear: (state) => {
            state.successMessage = "";
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // Lấy danh sách nhà hàng
            .addCase(get_allRestaurant.pending, (state) => {
                state.loader = true;
                state.errorMessage = "";
            })
            .addCase(get_allRestaurant.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.restaurants = payload;
                state.totalRestaurant = payload.length;
            })
            .addCase(get_allRestaurant.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload || "Không thể lấy danh sách nhà hàng.";
            })
            .addCase(change_seller_status.pending, (state) => {
                state.loader = true;
                state.errorMessage = "";
            })
            .addCase(change_seller_status.fulfilled, (state, { payload }) => {
                console.log("Data received in reducer:", payload);
                state.loader = false;
                state.restaurant = payload;
            })
            .addCase(change_seller_status.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload || "Không thể cập nhật trạng thái người bán.";
            })

            // Lấy chi tiết một nhà hàng
            .addCase(get_restaurant.pending, (state) => {
                state.loader = true;
                state.errorMessage = "";
            })
            .addCase(get_restaurant.fulfilled, (state, { payload }) => {
                console.log("Data received in reducer:", payload); 
                state.loader = false;
                state.restaurant = payload;
            })
            .addCase(get_restaurant.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload || "Không thể lấy dữ liệu nhà hàng.";
            });
    },
});

export const { messageClear } = restaurantReducer.actions;
export default restaurantReducer.reducer;
