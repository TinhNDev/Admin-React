import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";
import { jwtDecode } from "jwt-decode";

// Admin login
export const admin_login = createAsyncThunk(
    'auth/login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/user/login', info);
            const { metadata } = data;
            
            if (!metadata || !metadata.tokens) {
                throw new Error("Invalid response from server");
            }
            
            const accessToken = metadata.tokens.accessToken;
            localStorage.setItem('userToken', accessToken);
            
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            return fulfillWithValue({ metadata, accessToken });
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Login failed" });
        }
    }
);
export const seller_register = createAsyncThunk(
    'auth/seller_register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const updatedInfo = {
                ...info,
                fcmToken: "cdfOiecxQr-kDJLWiu_YSX:APA91bG5SDal5HAXyaD5o_uFaqljdJDXWN3m7IEbvIlP4o6PclTcknP02q5HL-JCAM1cMfVh3kouwF7swGnE2Cz1yQda8K58Wtht4IuPEoClBVntCuT-h",
            };

            const { data } = await api.post('/user/signup', updatedInfo);

            const { metadata } = data;

            return fulfillWithValue({ metadata });
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Registration failed" });
        }
    }
);







  

// Decode token function
const decodeToken = (token) => {
    try {
        return token ? jwtDecode(token) : null;
    } catch (error) {
        return null;
    }
};

// Auth Reducer
const authReducer = createSlice({
    name: 'auth',
    initialState: {
        loader: false,
        userInfo: decodeToken(localStorage.getItem('userToken')),
        errorMessage: '',
        successMessage: '',
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
        clearUserData: (state) => {
            state.userInfo = null;
            state.token = null;
            state.role = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(admin_login.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
                state.successMessage = '';
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                state.errorMessage = payload?.message || "Incorrect password or email";
                state.loader = false;
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                const userInfo = decodeToken(payload.accessToken);
                state.successMessage = "Login successful";
                state.loader = false;
                state.userInfo = userInfo;
            })
            
            // Register cases
            .addCase(seller_register.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
                state.successMessage = '';
            })
            .addCase(seller_register.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message || "SignUp successfully";
                state.loader = false;
            })
            .addCase(seller_register.rejected, (state, { payload }) => {
                state.errorMessage = payload?.message || "Registration failed";
                state.loader = false;
            })
            
            
    }
});

export const { messageClear, clearUserData } = authReducer.actions;
export default authReducer.reducer;
