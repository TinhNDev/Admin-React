import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";


export const get_allRestaurant = createAsyncThunk(
    'admin/get_allRestaurant',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            // Give token and userID

            const token = localStorage.getItem("adminToken");
            const adminId = getState().auth.userInfo.user_id || localStorage.getItem("adminId");

            //console.log("Token hiện tại:", token);
            //console.log("Admin ID hiện tại:", adminId);

            if (!token || !adminId) {
                return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
            }

           // console.log("Gửi request với:", { parPage, page, searchValue, adminId });

            const { data } = await api.get('/admin/restaurant', {
                params: { parPage, page, search: searchValue },
                headers: {
                    "Authorization": token,
                    "x-client-id": adminId
                }
            });

            //console.log("Dữ liệu nhận được:", data);

            return fulfillWithValue(data.metadata); 
        } catch (error) {
            console.error("Lỗi API:", error?.response?.data || error.message);
            
            return rejectWithValue(
                error.response?.data?.message || "Không thể kết nối đến server."
            );
        }
    }
);

// Restaurant Reducer
const restaurantReducer = createSlice({
    name: 'restaurant',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        restaurants: [], 
        totalRestaurant: 0 
    },
    reducers: {
        messageClear: (state) => {
            state.successMessage = "";
            state.errorMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
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
            });
    }
});

// Export reducer & action
export const { messageClear } = restaurantReducer.actions;
export default restaurantReducer.reducer;
