import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { get_order_detail } from "../store/reducers/orderReducer";
import moment from "moment";
import "moment/locale/vi";

const OrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orderDetail, loader } = useSelector((state) => state.order);
  console.log(orderDetail);

  useEffect(() => {
    if (orderId) {
      dispatch(get_order_detail(orderId));
    }
  }, [dispatch, orderId]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      ORDER_CONFIRMED: "bg-blue-100 text-blue-800",
      ORDER_CANCELED: "bg-red-100 text-red-800",
      DELIVERING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      PREPARING_ORDER: "bg-purple-100 text-purple-800",
      UNPAID: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const statusMap = {
      ORDER_CONFIRMED: "Đã xác nhận",
      ORDER_CANCELED: "Đã hủy",
      DELIVERING: "Đang giao hàng",
      COMPLETED: "Hoàn thành",
      PREPARING_ORDER: "Đang chuẩn bị",
      UNPAID: "Chưa thanh toán",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết đơn hàng
          </h1>
        </div>

        {loader ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : orderDetail ? (
          <div className="space-y-6">
            {/* Order Status and ID */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Mã đơn hàng:</span>
                <span className="ml-2 font-medium">#{orderDetail.id}</span>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeStyle(
                    orderDetail.order_status
                  )}`}
                >
                  {getStatusText(orderDetail.order_status)}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">
                Thông tin khách hàng
              </h2>
              <div className="grid gap-3">
                <div className="flex">
                  <span className="text-gray-600 w-32">Người nhận:</span>
                  <span>{orderDetail.receiver_name}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Số điện thoại:</span>
                  <span>{orderDetail.phone_number}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Địa chỉ:</span>
                  <span className="flex-1">{orderDetail.address_receiver}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Ghi chú:</span>
                  <span>{orderDetail.note || "Không có"}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Chi tiết món</h2>
              <div className="space-y-3">
                {orderDetail.listCartItem?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                        {item.toppings?.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Toppings: {item.toppings.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Tổng cộng</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{formatCurrency(parseFloat(orderDetail.price))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>
                    {formatCurrency(parseFloat(orderDetail.delivery_fee))}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Tổng cộng:</span>
                  <span className="font-medium text-lg">
                    {formatCurrency(
                      parseFloat(orderDetail.price) +
                        parseFloat(orderDetail.delivery_fee)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Thông tin đơn hàng</h2>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span>{orderDetail.order_pay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian đặt:</span>
                  <span>
                    {moment(orderDetail.order_date).format(
                      "HH:mm - DD/MM/YYYY"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy thông tin đơn hàng
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
