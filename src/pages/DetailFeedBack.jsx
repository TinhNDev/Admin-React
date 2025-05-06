import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetch_feedback_detail, clearFeedbackDetail } from "../store/reducers/feedbackReducer";
import {
  HiUserCircle,
  HiBuildingStorefront,
  HiOutlineChatBubbleLeftRight as HiChat,
  HiArrowLongRight
} from "react-icons/hi2";
import { FaRegEnvelope } from "react-icons/fa";
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

  if (!feedbackDetail || !feedbackDetail.feedback) return null;

  const {
    feedback,
    customer_info,
    restaurant_info
  } = feedbackDetail;

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white min-h-screen">
      {/* Header với nút quay lại */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Quay lại</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Phản hồi #{feedback.feedback_id}
        </h1>
      </div>

      {/* Nội dung phản hồi */}
      <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
        <div className="flex items-center gap-4 mb-6">
          <HiChat className="text-3xl text-blue-700" />
          <h2 className="text-2xl font-semibold">Nội dung phản hồi</h2>
        </div>
        <p className="text-gray-800 text-xl leading-relaxed border-l-8 border-blue-400 pl-6">
          {feedback.content}
        </p>
      </div>

      {/* Grid thông tin với icon mũi tên ở giữa */}
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* Thông tin người gửi */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <HiUserCircle className="text-4xl text-green-700" />
            <h2 className="text-2xl font-semibold">Thông tin người gửi</h2>
          </div>
          <div className="space-y-4 text-lg">
            <div>
              <label className="text-gray-600">Tên:</label>
              <p className="font-semibold text-gray-900">{customer_info?.customer_name}</p>
            </div>
            <div>
              <label className="text-gray-600">Số điện thoại:</label>
              <p className="font-semibold text-gray-900">{customer_info?.customer_phone}</p>
            </div>
            {customer_info?.customer_image && (
              <div>
                <label className="text-gray-600">Hình ảnh:</label>
                <img
                  src={customer_info.customer_image}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover mt-3"
                />
              </div>
            )}
          </div>
        </div>

        {/* Icon lá thư trên mũi tên dài */}
        <div className="hidden md:flex flex-col items-center justify-center relative min-h-[120px] w-full">
          <FaRegEnvelope size={48} className="text-blue-600 mb-3 z-10 bg-white rounded-full p-2 shadow-lg" />
          <div className="flex flex-col items-center w-full">
            <div className="w-32 h-1 bg-blue-300 rounded-full" />
            <HiArrowLongRight className="text-8xl text-blue-600 -mt-5" />
            <div className="w-32 h-1 bg-blue-300 rounded-full -mt-5" />
          </div>
        </div>

        {/* Thông tin nhà hàng */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <HiBuildingStorefront className="text-4xl text-orange-700" />
            <h2 className="text-2xl font-semibold">Nhà hàng liên quan</h2>
          </div>
          <div className="space-y-4 text-lg">
            <div>
              <label className="text-gray-600">Tên nhà hàng:</label>
              <p className="font-semibold text-gray-900">{restaurant_info?.restaurant_name}</p>
            </div>
            <div>
              <label className="text-gray-600">Địa chỉ:</label>
              <p className="font-semibold text-gray-900">{restaurant_info?.restaurant_address}</p>
            </div>
            <div>
              <label className="text-gray-600">Liên hệ:</label>
              <p className="font-semibold text-gray-900">{restaurant_info?.restaurant_phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFeedback;
