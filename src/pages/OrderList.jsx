import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { useNavigate } from "react-router-dom";

const OrderList = ({ orders, userType = "restaurant" }) => {
  const navigate = useNavigate();
  console.log(orders);
  const handleViewDetail = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };

  const getStatusBadgeStyle = (status) => {
    return `px-2 py-1 text-base rounded-full ${getStatusColorClass(
      status
    )} font-medium`;
  };

  const getStatusColorClass = (status) => {
    const colorMap = {
      PAID: "bg-red-100 text-red-800",
      UNPAID: "bg-red-100 text-red-800",
      PREPARING_ORDER: "bg-yellow-100 text-yellow-800",
      ORDER_CANCELED: "bg-red-100 text-red-800",
      DELIVERING: "bg-blue-100 text-blue-800",
      GIVED_ORDER: "bg-purple-100 text-purple-800",
      ORDER_RECEIVED: "bg-purple-100 text-purple-800",
      ORDER_CONFIRMED: "bg-green-100 text-green-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const RestaurantOrderList = () => (
    <table className="w-full text-base text-left text-gray-700">
      <thead className="text-base text-gray-700 uppercase bg-gray-100 border-b">
        <tr>
          <th className="py-3 px-4">Mã ĐH</th>
          <th className="py-3 px-4">Khách hàng</th>
          <th className="py-3 px-4">Địa chỉ</th>
          <th className="py-3 px-4">Tổng tiền</th>
          <th className="py-3 px-4">PTTT</th>
          <th className="py-3 px-4">Trạng thái</th>
          <th className="py-3 px-4">Thời gian</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
          <tr
            key={order.order_id}
            className="bg-white border-b hover:bg-blue-300 cursor-pointer"
            onClick={() => handleViewDetail(order.order_id)} // Thêm sự kiện click vào dòng
          >
            <td className="py-2 px-4 font-medium text-base">#{order.id}</td>
            <td className="py-2 px-4 font-medium text-base">
              <div>{order.receiver_name}</div>
              <div className="text-base text-gray-500">
                {order.phone_number}
              </div>
            </td>
            <td className="py-2 px-4 font-medium text-base truncate max-w-xs">
              {order.address}
            </td>
            <td className="py-2 px-4 font-medium text-base">
              <div>{formatCurrency(parseFloat(order.price))}</div>
              <div className="text-base text-gray-500">
                + {formatCurrency(parseFloat(order.delivery_fee))} phí ship
              </div>
            </td>
            <td className="py-2 px-4 font-medium text-base">
              {order.order_pay}
            </td>
            <td className="py-2 px-4 font-medium text-base">
              <span className={getStatusBadgeStyle(order.order_status)}>
                {order.order_status}
              </span>
            </td>
            <td className="py-2 px-4 font-medium text-base">
              <div>{moment(order.order_date).format("DD/MM/YYYY")}</div>
              <div className="text-base text-gray-500">
                {moment(order.order_date).format("HH:mm")}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const ShipperOrderList = () => (
    <table className="w-full text-left text-gray-700">
      <thead className="text-base text-gray-700 uppercase bg-gray-100 border-b">
        <tr>
          <th className="py-3 px-4">Mã ĐH</th>
          <th className="py-3 px-4">Khách hàng</th>
          <th className="py-3 px-4">Địa chỉ</th>
          <th className="py-3 px-4">Tổng tiền</th>
          <th className="py-3 px-4">PTTT</th>
          <th className="py-3 px-4">Trạng thái</th>
          <th className="py-3 px-4">Thời gian</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
          <tr
            key={order.order_id}
            className="bg-white border-b hover:bg-blue-300 cursor-pointer"
            onClick={() => handleViewDetail(order.id)} // Thêm sự kiện click vào dòng
          >
            <td className="py-2 px-4 font-medium text-base">
              {order.order_id}
            </td>
            <td className="py-2 px-4 font-medium text-base">
              <div className="text-base">{order.receiver_name}</div>
              <div className="text-base text-gray-500">
                {order.phone_number}
              </div>
            </td>
            <td className="py-2 px-4 font-medium text-base truncate max-w-xs">
              {order.address}
            </td>
            <td className="py-2 px-4 font-medium text-base">
              <div>{formatCurrency(parseFloat(order.price))}</div>
              <div className="text-base text-gray-500">
                + {formatCurrency(parseFloat(order.delivery_fee))} phí ship
              </div>
            </td>
            <td className="py-2 px-4 font-medium text-base">
              {order.order_pay}
            </td>
            <td className="py-2 px-4 font-medium text-base">
              <span className={getStatusBadgeStyle(order.order_status)}>
                {order.order_status}
              </span>
            </td>
            <td className="py-2 px-4 font-medium text-base">
              <div>{moment(order.order_date).format("DD/MM/YYYY")}</div>
              <div className="text-base text-gray-500">
                {moment(order.order_date).format("HH:mm")}
              </div>
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
