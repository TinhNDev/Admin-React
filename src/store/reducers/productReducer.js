import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api"; 

export const add_product = createAsyncThunk(
    "product/add_product",
    async (product, { rejectWithValue, fulfillWithValue, getState }) => {
      try {
        const token = localStorage.getItem("userToken");
        const sellerId = getState().auth.userInfo?.user_id || localStorage.getItem("sellerID");
  
        if (!token || !sellerId) {
          return rejectWithValue({
            message: "Thiếu thông tin xác thực (token hoặc sellerId).",
            statusCode: 401
          });
        }
  
 
        const formattedPayload = { 
          productData: {
            name: product.get('name'),
            descriptions: product.get('descriptions'),
            price: Number(product.get('price')),
            quantity: Number(product.get('quantity')),
            is_available: product.get('is_available') === 'true',
            is_draft: product.get('is_draft') === 'true'
          }
        };
        
        // Xử lý riêng cho image nếu có
        if (product.get('image') instanceof File) {

        }
  
        const { data } = await api.post(
          `/products`,
          formattedPayload,
          {
            headers: {
              Authorization: token,
              "x-client-id": sellerId,
              "Content-Type": "application/json"
            },
          }
        );
  
        return fulfillWithValue(data.metadata);
      } catch (error) {
        console.error("API Error:", error);
        
        // Xử lý lỗi 404
        if (error.response && error.response.status === 404) {
          return rejectWithValue({
            message: "Không tìm thấy tài nguyên yêu cầu (404). Vui lòng kiểm tra lại endpoint API.",
            statusCode: 404
          });
        }
        
        // Xử lý lỗi 500
        if (error.response && error.response.status === 500) {
          return rejectWithValue({
            message: "Lỗi máy chủ (500). Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
            statusCode: 500
          });
        }
        
        // Xử lý các lỗi khác
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
        
        return rejectWithValue({
          message: errorMessage,
          statusCode: error.response?.status || 0
        });
      }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        products: [],
        product: '',
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
            .addCase(add_product.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
                state.successMessage = '';
                state.statusCode = null;
            })
            .addCase(add_product.rejected, (state, action) => {
                state.loader = false;
                
                if (typeof action.payload === 'object') {
                    state.errorMessage = action.payload.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
                    state.statusCode = action.payload.statusCode || null;
                } else {
                    state.errorMessage = action.payload || 'Đã xảy ra lỗi. Vui lòng thử lại.';
                }
            })
            .addCase(add_product.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.message || 'Thêm sản phẩm thành công';
                state.statusCode = 200;
            });
    }
});

export const { messageClear } = productSlice.actions;
export default productSlice.reducer;
