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




// Logout function
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const token = localStorage.getItem("userToken");
            const userID = getState().auth?.userInfo?.user_id;

            console.log("🛠 Token gửi đi:", token);
            console.log("🛠 UserID gửi đi:", userID);

            if (!token || !userID) {
                return rejectWithValue("Không có quyền hành động.");
            }

            const response = await api.post(
                "/user/logout",
                {}, // Không cần gửi dữ liệu trong body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-client-id": userID,
                    },
                }
            );

            console.log("✅ Logout thành công:", response.data);

            localStorage.removeItem("userToken");
            return fulfillWithValue("Logout successful");
        } catch (error) {
            console.error("❌ Lỗi khi logout:", error.response?.data || error.message);
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
                state.successMessage = payload?.metadata?.meesage || "Logout successful"; 
                state.userInfo = null;
                state.token = null;
                state.errorMessage = ""; 
            });
            
    }
});

export const { messageClear, clearUserData } = authReducer.actions;
export default authReducer.reducer;
