import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";
import { jwtDecode } from "jwt-decode";


export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async(info, { rejectWithValue,fulfillWithValue }) => {
        try {
            const {data} = await api.post('/user/login',info)
            localStorage.setItem('adminToken',data.token)
           // console.log(data) 
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method 

const decodeToken = (token) => {
    if (token) {
        const adminInfo = jwtDecode(token)
        return adminInfo
    } else {
        return ''
    }
}
// End Method 



const authReducer = createSlice({
    name: 'auth',
    initialState: {
        loader: false,
        adminInfo: decodeToken(localStorage.getItem('adminToken')),
        errorMessage: '',
        successMessage: '', 
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
        user_reset: (state) => {
            state.userInfo = ""
        },
        logout: (state) => {
            state.userInfo = ""
            localStorage.removeItem('adminToken')
        }
    },
    extraReducers: (builder) => {
        builder 
            .addCase(admin_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                state.errorMessage = payload.error;
                state.loader = false;
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                const adminInfo = decodeToken(payload.token)
                state.successMessage = payload.message;
                state.loader = false;
                state.userInfo = adminInfo
            })
    }
})

export const { messageClear, user_reset, logout } = authReducer.actions
export default authReducer.reducer