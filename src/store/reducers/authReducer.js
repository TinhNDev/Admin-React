import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";
import { jwtDecode } from "jwt-decode";

// Admin login
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
            localStorage.setItem('userToken', accessToken);
            
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            return fulfillWithValue({ metadata, accessToken });
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Login failed" });
        }
    }
);

// Logout function
export const logout = createAsyncThunk(
    'auth/logout',
    async ({ navigate, role }, { rejectWithValue, fulfillWithValue, dispatch }) => {
        try {
            const { data } = await api.post('/user/logout', {}, { withCredentials: true });

            // Xóa token khỏi localStorage và header
            localStorage.removeItem('userToken');

            // Điều hướng sau khi logout
            if (role === 'admin') {
                navigate('/admin/login');
            } else {
                navigate('/login');
            }

            dispatch(clearUserData());
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Logout failed" });
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
            
            // Logout cases
            .addCase(logout.pending, (state) => {
                state.loader = true;
            }) 
            .addCase(logout.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || "Logout failed";
            }) 
            .addCase(logout.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload?.message || "Logout successful";
                state.userInfo = null;
                state.token = null;
            });
    }
});

export const { messageClear, clearUserData } = authReducer.actions;
export default authReducer.reducer;
