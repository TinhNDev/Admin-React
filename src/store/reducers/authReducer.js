import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";
import { jwtDecode } from "jwt-decode";

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/user/login', info);
            const { metadata } = data;
            
            if (!metadata || !metadata.tokens) {
                throw new Error("Invalid response from server");
            }
            
            const accessToken = metadata.tokens.accessToken;
            localStorage.setItem('adminToken', accessToken);
            
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            return fulfillWithValue({ metadata, accessToken });
            
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Login failed" });
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
        userInfo: decodeToken(localStorage.getItem('adminToken')),
        errorMessage: '',
        successMessage: '',
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
        user_reset: (state) => {
            state.userInfo = null;
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('adminToken');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(admin_login.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
                state.successMessage = '';
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                if (payload?.message) {
                    state.errorMessage = payload.message; 
                } else {
                    state.errorMessage = "Incorrect password or email";
                }
                state.loader = false;
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                const userInfo = decodeToken(payload.accessToken);
                state.successMessage = "Login successful";
                state.loader = false;
                state.userInfo = userInfo;
            });
    }
});

export const { messageClear, user_reset, logout } = authReducer.actions;
export default authReducer.reducer;
