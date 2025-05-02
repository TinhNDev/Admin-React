import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Fetch feedbacks
export const fetch_feedbacks = createAsyncThunk(
  "feedback/fetch_feedbacks",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("userToken");
      const adminId =
        getState().auth.userInfo?.user_id || localStorage.getItem("adminId");
      if (!token || !adminId) {
        return rejectWithValue("Không có quyền truy cập, vui lòng đăng nhập.");
      }
      const { data } = await api.get("/feedback", {
        headers: {
          Authorization: token,
          "x-client-id": adminId,
          "Content-Type": "application/json",
        },
      });
      console.log(data);
      return data.metadata; // Assuming metadata contains the feedback list
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to fetch feedbacks" }
      );
    }
  }
);

// Feedback Reducer
const feedbackReducer = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    loader: false,
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    clearFeedbackMessages: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedbacks cases
      .addCase(fetch_feedbacks.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(fetch_feedbacks.fulfilled, (state, { payload }) => {
        state.feedbacks = payload;
        state.loader = false;
      })
      .addCase(fetch_feedbacks.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Failed to fetch feedbacks";
        state.loader = false;
      });
  },
});

export const { clearFeedbackMessages } = feedbackReducer.actions;
export default feedbackReducer.reducer;
