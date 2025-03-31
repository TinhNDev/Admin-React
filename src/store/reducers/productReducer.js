import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 

export const add_product = createAsyncThunk(
    "restaurant/add_product",
    async (product, { rejectWithValue, fulfillWithValue, getState }) => {
      try {
        const token = localStorage.getItem("userToken");
        const sellerId = getState().auth.userInfo?.user_id || localStorage.getItem("sellerID");
  
        if (!token || !sellerId) {
          throw new Error("Missing authentication information (token or sellerId).");
        }
  
        // Định dạng payload đúng yêu cầu
        const formattedPayload = { restaurant: product };
  
        const { data } = await api.put(
          `/restaurant`, // API endpoint
          formattedPayload,
          {
            headers: {
              Authorization: token,
              "x-client-id": sellerId,
            },
          }
        );
  
        return fulfillWithValue(data.metadata);
      } catch (error) {
        console.error("API Error:", error?.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || "Server error (500). Please check the API.");
      }
    }
  );



  


  





 
  export const productReducer = createSlice({
    name: 'product',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        products: [],
        product: '',
        totalProduct: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.successMessage = '';
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(add_product.pending, (state) => {
                state.loader = true;
            })
            .addCase(add_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload ? payload.error : 'Something went wrong';
            })
            .addCase(add_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            });
    }
});

// Export action
export const { messageClear } = productReducer.actions;
export default productReducer.reducer;
