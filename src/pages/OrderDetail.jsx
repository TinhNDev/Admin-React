import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiTruck,
  FiHome,
  FiInfo,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiFileText,
  FiTag,
  FiZap,
} from "react-icons/fi";
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

  const calculateSubtotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;

    return items.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      const itemTotal = itemPrice * quantity;
      return total + itemTotal;
    }, 0);
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      ORDER_CONFIRMED: "bg-blue-100 text-blue-800 border border-blue-200",
      ORDER_CANCELED: "bg-red-100 text-red-800 border border-red-200",
      DELIVERING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      COMPLETED: "bg-green-100 text-green-800 border border-green-200",
      PREPARING_ORDER: "bg-purple-100 text-purple-800 border border-purple-200",
      UNPAID: "bg-gray-100 text-gray-800 border border-gray-200",
      PAID: "bg-green-100 text-green-800 border border-green-200",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ORDER_CONFIRMED":
        return "✓";
      case "ORDER_CANCELED":
        return "✕";
      case "DELIVERING":
        return "🚚";
      case "COMPLETED":
        return "✓";
      case "PREPARING_ORDER":
        return "👨‍🍳";
      case "UNPAID":
        return "₫";
      case "PAID":
        return "💰";
      default:
        return "•";
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      ORDER_CONFIRMED: "Đã xác nhận",
      ORDER_CANCELED: "Đã hủy",
      DELIVERING: "Đang giao hàng",
      COMPLETED: "Hoàn thành",
      PREPARING_ORDER: "Đang chuẩn bị",
      UNPAID: "Chưa thanh toán",
      PAID: "Đã thanh toán",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="px-2 lg:px-7 pt-5 pb-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-4 rounded-t-xl shadow-sm border-b relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Chi tiết đơn hàng
                </h1>
                {orderDetail?.id && (
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500">
                      #{orderDetail.id}
                    </span>
                    {orderDetail?.order_status && (
                      <div className="ml-3 flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusBadgeStyle(
                            orderDetail.order_status
                          )}`}
                        >
                          <span className="mr-1">
                            {getStatusIcon(orderDetail.order_status)}
                          </span>
                          {getStatusText(orderDetail.order_status)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {orderDetail?.order_status === "ORDER_CONFIRMED" && (
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition shadow-sm">
                Theo dõi đơn hàng
              </button>
            )}
          </div>
        </div>

        {loader ? (
          <div className="flex justify-center py-12 bg-white rounded-b-xl shadow-sm">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
              <p className="mt-3 text-gray-600">
                Đang tải thông tin đơn hàng...
              </p>
            </div>
          </div>
        ) : orderDetail ? (
          <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
            {/* Progress tracking for active orders */}
            {(orderDetail.order_status === "ORDER_CONFIRMED" ||
              orderDetail.order_status === "PREPARING_ORDER" ||
              orderDetail.order_status === "DELIVERING") && (
              <div className="px-4 py-5 border-b">
                <div className="w-full flex justify-between relative">
                  {/* Progress line */}
                  <div className="absolute top-4 left-10 right-10 h-1 bg-gray-200" />
                  <div
                    className="absolute top-4 left-10 h-1 bg-orange-500 transition-all duration-500"
                    style={{
                      width:
                        orderDetail.order_status === "ORDER_CONFIRMED"
                          ? "0%"
                          : orderDetail.order_status === "PREPARING_ORDER"
                          ? "50%"
                          : "100%",
                    }}
                  />

                  {/* Confirmed Step */}
                  <div className="z-10 flex flex-col items-center relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        orderDetail.order_status === "PREPARING_ORDER" ||
                        orderDetail.order_status === "DELIVERING"
                          ? "bg-orange-500 text-white"
                          : "border-2 border-orange-500 bg-white text-orange-500"
                      }`}
                    >
                      <span className="text-sm">1</span>
                    </div>
                    <p className="text-xs mt-2 font-medium text-center">
                      Xác nhận
                    </p>
                  </div>

                  {/* Preparing Step */}
                  <div className="z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        orderDetail.order_status === "PREPARING_ORDER" ||
                        orderDetail.order_status === "DELIVERING"
                          ? "bg-orange-500 text-white"
                          : "border-2 border-gray-300 bg-white text-gray-500"
                      }`}
                    >
                      <span className="text-sm">2</span>
                    </div>
                    <p className="text-xs mt-2 font-medium text-center">
                      Chuẩn bị
                    </p>
                  </div>

                  {/* Delivering Step */}
                  <div className="z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        orderDetail.order_status === "DELIVERING"
                          ? "bg-orange-500 text-white"
                          : "border-2 border-gray-300 bg-white text-gray-500"
                      }`}
                    >
                      <span className="text-sm">3</span>
                    </div>
                    <p className="text-xs mt-2 font-medium text-center">
                      Giao hàng
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {/* Restaurant Info and Customer Info */}
              <div className="space-y-4">
                {/* Restaurant Info */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-3">
                    <FiHome className="text-orange-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Nhà hàng
                    </h2>
                  </div>
                  <div className="flex items-start gap-3">
                    <img
                      src={orderDetail.restaurant?.image}
                      alt={orderDetail.restaurant?.name}
                      className="w-20 h-20 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {orderDetail.restaurant?.name}
                      </h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{orderDetail.restaurant?.address}</p>
                        <p className="mt-1">
                          SĐT: {orderDetail.restaurant?.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-3">
                    <FiUser className="text-orange-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Khách hàng
                    </h2>
                  </div>
                  <div className="flex items-start gap-3">
                    {orderDetail.customer?.image ? (
                      <img
                        src={orderDetail.customer?.image}
                        alt={orderDetail.customer?.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                        <span className="text-gray-500 text-xl font-bold">
                          {orderDetail.customer?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {orderDetail.customer?.name}
                      </h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>SĐT: {orderDetail.customer?.phone_number}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                {orderDetail.driver ? (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      <FiTruck className="text-orange-500 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-800">
                        Tài xế
                      </h2>
                    </div>
                    <div className="flex items-start gap-3">
                      <img
                        src={orderDetail.driver?.image}
                        alt={orderDetail.driver?.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {orderDetail.driver?.name}
                        </h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>SĐT: {orderDetail.driver?.phone_number}</p>
                          <p className="mt-1">
                            {orderDetail.driver?.car_name} -{" "}
                            {orderDetail.driver?.license_plate}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                              orderDetail.driver?.status === "ONLINE"
                                ? "bg-green-100 text-green-800"
                                : orderDetail.driver?.status === "BUSY"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {orderDetail.driver?.status === "ONLINE"
                              ? "Đang hoạt động"
                              : orderDetail.driver?.status === "BUSY"
                              ? "Đang bận"
                              : orderDetail.driver?.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border text-center text-gray-500">
                    <div className="flex items-center mb-3">
                      <FiTruck className="text-orange-500 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-800">
                        Tài xế
                      </h2>
                    </div>
                    <p>Chưa có tài xế nhận đơn hàng</p>
                  </div>
                )}

                {/* Order Info */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-3">
                    <FiInfo className="text-orange-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Thông tin đơn hàng
                    </h2>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-gray-600 flex items-center">
                        <FiCreditCard className="mr-2" /> Phương thức thanh
                        toán:
                      </span>
                      <span className="font-medium">
                        {orderDetail.order?.order_pay === "CASH"
                          ? "Tiền mặt"
                          : orderDetail.order?.order_pay === "ZALOPAY"
                          ? "ZaloPay"
                          : orderDetail.order?.order_pay}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-gray-600 flex items-center">
                        <FiClock className="mr-2" /> Thời gian đặt:
                      </span>
                      <span className="font-medium">
                        {moment(orderDetail.order?.order_date).format(
                          "HH:mm - DD/MM/YYYY"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-gray-600 flex items-center">
                        <FiClock className="mr-2" /> Cập nhật lần cuối:
                      </span>
                      <span className="font-medium">
                        {moment(orderDetail.order?.updatedAt).format(
                          "HH:mm - DD/MM/YYYY"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items & Delivery */}
              <div className="space-y-4">
                {/* Delivery Address */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-3">
                    <FiMapPin className="text-orange-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Địa chỉ giao hàng
                    </h2>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-gray-700">
                      {orderDetail.order?.address_receiver}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Vị trí: [{orderDetail.order?.latitude},{" "}
                      {orderDetail.order?.longtitude}]
                    </p>
                    {orderDetail.order?.note && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                        <div className="flex items-center">
                          <FiFileText className="text-yellow-500 mr-2" />
                          <p className="text-sm font-medium text-gray-700">
                            Ghi chú:
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 italic pl-6">
                          {orderDetail.order?.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Coupon Info - New section */}
                {orderDetail.coupon && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      <FiTag className="text-orange-500 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-800">
                        Mã giảm giá đã áp dụng
                      </h2>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded border border-orange-100">
                            {orderDetail.coupon.code}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            {orderDetail.coupon.discount_type === "PERCENTAGE"
                              ? `${orderDetail.coupon.discount_value}%`
                              : formatCurrency(
                                  parseFloat(orderDetail.coupon.discount_value)
                                )}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {orderDetail.coupon.discount_type === "PERCENTAGE"
                              ? "Giảm theo phần trăm"
                              : "Giảm trực tiếp"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Flash Sale Info - New section */}
                {orderDetail.flash_sale && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      <FiZap className="text-orange-500 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-800">
                        Flash Sale
                      </h2>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">
                          Flash Sale giảm giá:
                        </span>
                        <span className="font-medium text-orange-600">
                          {formatCurrency(
                            parseFloat(orderDetail.flash_sale.amount)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-3">
                    <FiPackage className="text-orange-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Danh sách món
                    </h2>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {orderDetail.order?.listCartItem?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              {item.quantity}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(parseFloat(item.price))}
                            </p>
                            {item.toppings && item.toppings.length > 0 && (
                              <div className="mt-1">
                                <p className="text-xs text-gray-500">
                                  Topping:
                                </p>
                                <ul className="mt-0.5 space-y-0.5">
                                  {item.toppings.map((topping, index) => (
                                    <li
                                      key={topping.id}
                                      className="text-xs text-gray-600 flex items-center justify-between"
                                    >
                                      <span>{topping.topping_name}</span>
                                      <span className="text-orange-600">
                                        +
                                        {formatCurrency(
                                          parseFloat(topping.price)
                                        )}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-orange-600">
                            {formatCurrency(
                              parseFloat(item.price) * item.quantity +
                                (item.toppings?.reduce(
                                  (acc, topping) =>
                                    acc +
                                    parseFloat(topping.price) * item.quantity,
                                  0
                                ) || 0)
                            )}
                          </span>
                          {item.toppings && item.toppings.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Gồm topping
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-3">
                    <FiInfo className="text-orange-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Tổng cộng
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-white rounded">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span>
                        {formatCurrency(
                          calculateSubtotal(orderDetail.order?.listCartItem)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span>
                        {formatCurrency(
                          parseFloat(orderDetail.order?.delivery_fee)
                        )}
                      </span>
                    </div>

                    {/* Discount from coupon */}
                    {orderDetail.coupon && (
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span className="text-gray-600">
                          Giảm giá (Mã {orderDetail.coupon.code}):
                        </span>
                        <span className="text-red-600">
                          -{" "}
                          {orderDetail.coupon.discount_type === "PERCENTAGE"
                            ? formatCurrency(
                                (calculateSubtotal(
                                  orderDetail.order?.listCartItem
                                ) *
                                  parseFloat(
                                    orderDetail.coupon.discount_value
                                  )) /
                                  100
                              )
                            : formatCurrency(
                                parseFloat(orderDetail.coupon.discount_value)
                              )}
                        </span>
                      </div>
                    )}

                    {/* Discount from flash sale */}
                    {orderDetail.flash_sale && (
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span className="text-gray-600">
                          Giảm giá (Flash Sale):
                        </span>
                        <span className="text-red-600">
                          -{" "}
                          {formatCurrency(
                            parseFloat(orderDetail.flash_sale.amount)
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between p-3 bg-orange-50 rounded-lg mt-2 border border-orange-100">
                      <span className="font-medium">Tổng thanh toán:</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {formatCurrency(parseFloat(orderDetail.order?.price))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 border-t flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
              >
                <FiArrowLeft className="mr-2" /> Quay lại
              </button>

              {orderDetail.order_status === "ORDER_CONFIRMED" && (
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm">
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-b-xl shadow-sm">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiInfo className="text-2xl text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              Không tìm thấy thông tin đơn hàng
            </h3>
            <p className="text-gray-500 mt-2">
              Đơn hàng không tồn tại hoặc đã bị xóa
            </p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
            >
              Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
