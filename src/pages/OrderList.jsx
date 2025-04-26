import React from "react";
import moment from "moment";
import "moment/locale/vi";

const OrderList = ({ orders }) => {
  // Helper function to get status badge style
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
  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders?.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                #{order.id}
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
      {(!orders || orders.length === 0) && (
        <div className="text-center py-4 text-gray-500">
          Chưa có đơn hàng nào
        </div>
      )}
    </div>
  );
};

export default OrderList;
