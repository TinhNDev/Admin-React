import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
const OrderList = ({ orders, userType = "restaurant" }) => {
  const navigate = useNavigate();

  const handleViewDetail = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };
  const getStatusBadgeStyle = (status) => {
    // const statusInfo = getStatusInfo(status);
    return `bg-opacity-10 text-sm px-3 py-1 rounded-full border ${getStatusColorClass(
      status
    )}`;
  };

  const getStatusColorClass = (status) => {
    const colorMap = {
      PAID: "bg-[#FF6347] text-[#FF6347] border-[#FF6347]",
      UNPAID: "bg-[#FF6347] text-[#FF6347] border-[#FF6347]",
      PREPARING_ORDER: "bg-[#FF9800] text-[#FF9800] border-[#FF9800]",
      ORDER_CANCELED: "bg-[#FF0000] text-[#FF0000] border-[#FF0000]",
      DELIVERING: "bg-[#2196F3] text-[#2196F3] border-[#2196F3]",
      GIVED_ORDER: "bg-[#9C27B0] text-[#9C27B0] border-[#9C27B0]",
      ORDER_RECEIVED: "bg-[#9C27B0] text-[#9C27B0] border-[#9C27B0]",
      ORDER_CONFIRMED: "bg-[#28a745] text-[#28a745] border-[#28a745]",
    };
    return colorMap[status] || "bg-[#607D8B] text-[#607D8B] border-[#607D8B]";
  };

  const getStatusText = (status) => {
    const statusInfo = getStatusInfo(status);
    return statusInfo.text;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "PAID":
        return {
          color: "#FF6347",
          text: "Đơn hàng mới",
          icon: "bell-ring",
        };
      case "UNPAID":
        return {
          color: "#FF6347",
          text: "Đơn hàng mới",
          icon: "bell-ring",
        };
      case "PREPARING_ORDER":
        return {
          color: "#FF9800",
          text: "Đang chuẩn bị",
          icon: "food-variant",
        };
      case "ORDER_CANCELED":
        return {
          color: "#FF0000",
          text: "Đơn bị hủy",
          icon: "close-circle",
        };
      case "DELIVERING":
        return {
          color: "#2196F3",
          text: "Shipper đang lấy đơn",
          icon: "motorbike",
        };
      case "GIVED_ORDER":
      case "ORDER_RECEIVED":
        return {
          color: "#9C27B0",
          text: "Đã giao cho shipper",
          icon: "package-variant",
        };
      case "ORDER_CONFIRMED":
        return {
          color: "#28a745",
          text: "Đã giao xong",
          icon: "check-circle",
        };
      default:
        return {
          color: "#607D8B",
          text: "Không xác định",
          icon: "information",
        };
    }
  };
  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Return restaurant-specific view
  const RestaurantOrderList = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Mã ĐH
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Khách hàng
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Địa chỉ
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Tổng tiền
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            PTTT
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Trạng thái
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Thời gian
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Chi tiết
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders?.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap text-sm">#{order.id}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {order.receiver_name}
                </div>
                <div className="text-gray-500">{order.phone_number}</div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="text-sm text-gray-900 max-w-xs truncate">
                {order.address_receiver}
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {formatCurrency(parseFloat(order.price))}
                </div>
                <div className="text-gray-500">
                  + {formatCurrency(parseFloat(order.delivery_fee))} phí ship
                </div>
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span className="text-sm text-gray-900">{order.order_pay}</span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeStyle(
                  order.order_status
                )}`}
              >
                {getStatusText(order.order_status)}
              </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="text-sm text-gray-500">
                <div>{moment(order.order_date).format("DD/MM/YYYY")}</div>
                <div>{moment(order.order_date).format("HH:mm")}</div>
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm">
              <button
                onClick={() => handleViewDetail(order.id)}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <FiEye className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Return shipper-specific view
  const ShipperOrderList = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Mã ĐH
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Người nhận
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Địa chỉ giao
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Phí ship
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Trạng thái
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Thời gian
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Chi tiết
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders?.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap text-sm">#{order.id}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {order.receiver_name}
                </div>
                <div className="text-gray-500">{order.phone_number}</div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="text-sm text-gray-900 max-w-xs truncate">
                {order.address_receiver}
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(parseFloat(order.delivery_fee))}
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeStyle(
                  order.order_status
                )}`}
              >
                {getStatusText(order.order_status)}
              </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="text-sm text-gray-500">
                <div>{moment(order.order_date).format("DD/MM/YYYY")}</div>
                <div>{moment(order.order_date).format("HH:mm")}</div>
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm">
              <button
                onClick={() => handleViewDetail(order.id)}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <FiEye className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="overflow-x-auto">
      {userType === "restaurant" ? (
        <RestaurantOrderList />
      ) : (
        <ShipperOrderList />
      )}
      {(!orders || orders.length === 0) && (
        <div className="text-center py-4 text-gray-500">
          Chưa có đơn hàng nào
        </div>
      )}
    </div>
  );
};

export default OrderList;
