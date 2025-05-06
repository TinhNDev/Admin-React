import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetch_feedback_detail, clearFeedbackDetail } from "../store/reducers/feedbackReducer";
import { HiUserCircle, HiBuildingStorefront, HiOutlineChatBubbleLeftRight as HiChat } from "react-icons/hi2";
import { RotatingLines } from "react-loader-spinner";

const DetailFeedback = () => {
  const { feedbackID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    feedbackDetail,
    detailLoader,
    detailErrorMessage 
  } = useSelector((state) => state.feedback);

  useEffect(() => {
    dispatch(fetch_feedback_detail(feedbackID));
    return () => {
      dispatch(clearFeedbackDetail());
    };
  }, [dispatch, feedbackID]);

  if (detailLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="50"
          visible={true}
        />
      </div>
    );
  }

  if (detailErrorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {detailErrorMessage}
      </div>
    );
  }

  if (!feedbackDetail?.metadata) return null;

  const { 
    feedback,
    customer_info,
    restaurant_info
  } = feedbackDetail.metadata;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header với nút quay lại */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Quay lại</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Phản hồi #{feedback.feedback_id}
        </h1>
      </div>

      {/* Nội dung phản hồi */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <div className="flex items-center gap-3 mb-4">
          <HiChat className="text-2xl text-blue-600" />
          <h2 className="text-xl font-semibold">Nội dung phản hồi</h2>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-blue-200 pl-4">
          {feedback.content}
        </p>
      </div>

      {/* Grid thông tin */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Thông tin người gửi */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <HiUserCircle className="text-3xl text-green-600" />
            <h2 className="text-xl font-semibold">Thông tin người gửi</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-gray-500">Tên:</label>
              <p className="font-medium">{customer_info.customer_name}</p>
            </div>
            <div>
              <label className="text-gray-500">Số điện thoại:</label>
              <p className="font-medium">{customer_info.customer_phone}</p>
            </div>
            {customer_info.customer_image && (
              <div>
                <label className="text-gray-500">Hình ảnh:</label>
                <img 
                  src={customer_info.customer_image} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full object-cover mt-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Thông tin nhà hàng */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <HiBuildingStorefront className="text-3xl text-orange-600" />
            <h2 className="text-xl font-semibold">Nhà hàng liên quan</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-gray-500">Tên nhà hàng:</label>
              <p className="font-medium">{restaurant_info.restaurant_name}</p>
            </div>
            <div>
              <label className="text-gray-500">Địa chỉ:</label>
              <p className="font-medium">{restaurant_info.restaurant_address}</p>
            </div>
            <div>
              <label className="text-gray-500">Liên hệ:</label>
              <p className="font-medium">{restaurant_info.restaurant_phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFeedback;
