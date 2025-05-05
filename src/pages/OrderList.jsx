import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiX } from "react-icons/fi";

const OrderList = ({ orders, userType = "restaurant" }) => {
  const navigate = useNavigate();

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    searchTerm: "",
  });
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "PAID", label: "Đơn hàng mới" },
    { value: "PREPARING_ORDER", label: "Đang chuẩn bị" },
    { value: "DELIVERING", label: "Đang giao" },
    { value: "ORDER_CONFIRMED", label: "Đã hoàn thành" },
    { value: "ORDER_CANCELED", label: "Đã hủy" },
  ];

  const paymentOptions = [
    { value: "", label: "Tất cả PTTT" },
    { value: "COD", label: "Tiền mặt" },
    { value: "ZALOPAY", label: "ZaloPay" },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
      paymentMethod: "",
      searchTerm: "",
    });
  };
  useEffect(() => {
    let result = [...orders];
    if (filters.status) {
      result = result.filter((order) => order.order_status === filters.status);
    }
    if (filters.paymentMethod) {
      result = result.filter(
        (order) => order.order_pay === filters.paymentMethod
      );
    }
    if (filters.startDate && filters.endDate) {
      result = result.filter((order) => {
        const orderDate = moment(order.order_date);
        return orderDate.isBetween(
          filters.startDate,
          filters.endDate,
          "day",
          "[]"
        );
      });
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.receiver_name.toLowerCase().includes(searchLower) ||
          order.phone_number.toString().includes(searchLower) ||
          order.id.toString().includes(searchLower)
      );
    }
    setFilteredOrders(result);
  }, [filters, orders]);
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
  const getStatusText = (status) => {
    switch (status) {
      case "PAID":
      case "UNPAID":
        return "Đơn hàng mới";
      case "PREPARING_ORDER":
        return "Đang chuẩn bị";
      case "ORDER_CANCELED":
        return "Đơn bị hủy";
      case "ORDER_RECEIVED":
        return "Đã giao cho shipper";
      case "DELIVERING":
        return "Shipper đang lấy đơn";
      case "ORDER_CONFIRMED":
        return "Đã giao xong";
      default:
        return "Không xác định";
    }
  };
  const FilterSection = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm
          </label>
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Tìm theo tên, SĐT, mã đơn..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phương thức TT
          </label>
          <select
            name="paymentMethod"
            value={filters.paymentMethod}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {paymentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filters */}
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Từ ngày
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đến ngày
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <FiX className="w-4 h-4" />
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );

  const RestaurantOrderList = ({ orders }) => (
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
                {getStatusText(order.order_status)}
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

  const ShipperOrderList = ({ orders }) => (
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
    <div>
      <FilterSection />
      <div className="overflow-x-auto">
        {userType === "restaurant" ? (
          <RestaurantOrderList orders={filteredOrders} />
        ) : (
          <ShipperOrderList orders={filteredOrders} />
        )}
        {(!filteredOrders || filteredOrders.length === 0) && (
          <div className="text-center py-4 text-gray-500">
            Chưa có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
