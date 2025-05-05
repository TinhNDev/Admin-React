import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { get_allOrder } from "../store/reducers/orderReducer";
import Pagination from "../components/Pagination";
import SortableHeader from "../components/SortableHeader";
import { useNavigate, Outlet } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { FiFilter, FiX } from "react-icons/fi";
const AllOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
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
  const { orders = [], totalOrders = 0 } = useSelector(
    (state) => state.order || {}
  );

  useEffect(() => {
    const params = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      sortField,
      sortOrder,
    };
    dispatch(get_allOrder(params));
  }, [searchValue, currentPage, parPage, sortField, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, parPage]);

  const handleViewDetail = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
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

  const getSortedData = () => {
    let data = [...orders];

    // Apply filters
    if (filters.status) {
      data = data.filter((order) => order.order_status === filters.status);
    }

    if (filters.paymentMethod) {
      data = data.filter((order) => order.order_pay === filters.paymentMethod);
    }

    if (filters.startDate && filters.endDate) {
      data = data.filter((order) => {
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
      data = data.filter(
        (order) =>
          order.receiver_name.toLowerCase().includes(searchLower) ||
          order.phone_number.toString().includes(searchLower) ||
          order.id.toString().includes(searchLower)
      );
    }

    if (sortField) {
      data.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        if (sortField === "id") {
          valueA = parseInt(valueA);
          valueB = parseInt(valueB);
        } else if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  };

  const paginatedData = getSortedData().slice(
    (currentPage - 1) * parPage,
    currentPage * parPage
  );

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-4xl font-semibold text-gray-800 mb-4">
        Danh sách đơn hàng
      </h1>

      <Search
        setParPage={setParPage}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
      />
      <FilterSection />

      <div className="overflow-x-auto mt-4 bg-white shadow rounded-lg">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-base uppercase border-b border-gray-200">
            <tr>
              <SortableHeader
                label="No"
                field="id"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-[5%]"
              />
              <SortableHeader
                label="Người đặt"
                field="receiver_name"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-[15%]"
              />
              <SortableHeader
                label="Địa chỉ"
                field="address_receiver"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-[25%]"
              />
              <SortableHeader
                label="Điện thoại"
                field="phone_number"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-[15%]"
              />
              <SortableHeader
                label="Tổng tiền"
                field="price"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-[10%]"
              />
              <SortableHeader
                label="Trạng thái"
                field="order_status"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-[15%]"
              />
              <SortableHeader
                label="Ngày đặt"
                field="order_date"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-[15%]"
              />
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((order, index) => (
              <tr
                key={order.id}
                onClick={() => handleViewDetail(order.id)}
                className="border-b hover:bg-gray-50 font-medium cursor-pointer text-xl"
              >
                <td className="px-4 py-3">
                  {(currentPage - 1) * parPage + index + 1}
                </td>
                <td className="px-4 py-3">{order.receiver_name}</td>
                <td className="px-4 py-3 truncate max-w-xs">
                  {order.address_receiver}
                </td>
                <td className="px-4 py-3">{order.phone_number}</td>
                <td className="px-4 py-3">
                  {parseInt(order.price, 10)?.toLocaleString()}₫
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-base px-2 py-1 rounded-full border ${
                      order.order_status === "PAID"
                        ? "bg-red-100 text-red-600 border-red-400"
                        : order.order_status === "PREPARING_ORDER"
                        ? "bg-orange-100 text-orange-600 border-orange-400"
                        : order.order_status === "ORDER_CANCELED"
                        ? "bg-red-200 text-red-700 border-red-500"
                        : order.order_status === "ORDER_RECEIVED"
                        ? "bg-purple-100 text-purple-600 border-purple-400"
                        : order.order_status === "DELIVERING"
                        ? "bg-blue-100 text-blue-600 border-blue-400"
                        : order.order_status === "ORDER_CONFIRMED"
                        ? "bg-green-100 text-green-600 border-green-400"
                        : "bg-gray-200 text-gray-700 border-gray-400"
                    }`}
                  >
                    {getStatusText(order.order_status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          pageNumber={currentPage}
          setPageNumber={setCurrentPage}
          totalItem={totalOrders}
          parPage={parPage}
          showItem={3}
        />
      </div>
      <Outlet />
    </div>
  );
};

export default AllOrder;
