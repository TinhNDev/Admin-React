import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";


export const get_allDriver = createAsyncThunk(
    "admin/get_allDriver",
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const token = localStorage.getItem("userToken");
            const adminId = getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

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
            return rejectWithValue(error.response?.data?.message || "Không thể kết nối đến server.");
        }
    }
);

export const get_driver = createAsyncThunk(
    'admin/get_driver',
    async (shipperID, { rejectWithValue, fulfillWithValue,getState }) => {
        try {
            console.log("shipperID ID:", shipperID);
            const token = localStorage.getItem("userToken");
            const adminId = getState().auth.userInfo?.user_id || localStorage.getItem("adminId");

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
            return rejectWithValue(error.response?.data?.message || "Không thể kết nối đến server.");
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

    },
});

export const { messageClear } = driverReducer.actions;
export default driverReducer.reducer;
