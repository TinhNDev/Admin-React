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

//Detail feedback
export const fetch_feedback_detail = createAsyncThunk(
  "feedback/fetch_feedback_detail",
  async (feedbackID, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/feedback/${feedbackID}/detail`);
      return data.metadata;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to fetch feedback detail" }
      );
    }
  }
);

// Feedback Reducer
const feedbackReducer = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    feedbackDetail: null,       // Thêm state cho chi tiết
    loader: false,              // Loader cho danh sách
    detailLoader: false,        // Loader riêng cho chi tiết
    errorMessage: "",
    detailErrorMessage: "",     // Lỗi riêng cho chi tiết
    successMessage: "",
  },
  reducers: {
    clearFeedbackMessages: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    clearFeedbackDetail: (state) => {  // Thêm action mới
      state.feedbackDetail = null;
      state.detailErrorMessage = "";
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý danh sách feedback (giữ nguyên)
      .addCase(fetch_feedbacks.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(fetch_feedbacks.fulfilled, (state, { payload }) => {
        state.feedbacks = payload;
        state.loader = false;
      })
      .addCase(fetch_feedbacks.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Failed to fetch feedbacks";
        state.loader = false;
      })

      // Xử lý chi tiết feedback (thêm mới)
      .addCase(fetch_feedback_detail.pending, (state) => {
        state.detailLoader = true;
        state.detailErrorMessage = "";
      })
      .addCase(fetch_feedback_detail.fulfilled, (state, { payload }) => {
        state.feedbackDetail = payload;
        state.detailLoader = false;
      })
      .addCase(fetch_feedback_detail.rejected, (state, { payload }) => {
        state.detailErrorMessage = payload?.error || "Failed to fetch feedback detail";
        state.detailLoader = false;
      });
  },
});

export const { clearFeedbackMessages, clearFeedbackDetail } = feedbackReducer.actions;
export default feedbackReducer.reducer;