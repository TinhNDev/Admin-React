import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { FaEye, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { get_allOrder } from "../store/reducers/orderReducer";
import SortableHeader from "../components/SortableHeader";
const AllOrder = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Lấy state order một cách an toàn
  const orderState = useSelector((state) => state.order || {});
  const { orders = [], totalOrders = 0 } = orderState;

  useEffect(() => {
    const params = {
      parPage: +parPage,
      page: +currentPage,
      searchValue,
      sortField,
      sortOrder,
    };
    dispatch(get_allOrder(params));
  }, [dispatch, searchValue, currentPage, parPage, sortField, sortOrder]);
  const navigate = useNavigate();

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
        return "Đơn hàng mới";
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
      case "UNPAID":
        return "Chưa thanh toán";
      default:
        return "Không xác định";
    }
  };

  const getSortedData = () => {
    let data = [...orders];

    // Sắp xếp nếu có sortField
    if (sortField) {
      data.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        if (sortField === "id") {
          valueA = parseInt(valueA, 10);
          valueB = parseInt(valueB, 10);
        } else if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Thêm phân trang frontend
    const startIndex = (currentPage - 1) * parPage;
    const endIndex = startIndex + parPage;
    return data.slice(startIndex, endIndex);
  };

  const sortedOrders = getSortedData();

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-black font-semibold text-lg mb-3">Tổng đơn hàng</h1>

      <Search
        setParPage={setParPage}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
      />

      <div className="relative overflow-x-auto mt-5">
        <table className="w-full text-lg text-left text-gray-700 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
            <tr>
            <SortableHeader
              label="No"
              field="id"
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              className="w-1/24" 
            />
            <SortableHeader
              label="Người đặt"
              field="receiver_name"
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              className="w-1/6" 
            />

            <SortableHeader
              label="Địa chỉ"
              field="address_receiver"
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              className="w-1/3" 
            />

              <SortableHeader
                label="Điện thoại"
                field="phone_number"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/10"
              />
              <SortableHeader
                label="Tổng tiền"
                field="price"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/7"
              />
              <SortableHeader
                label="Trạng thái"
                field="order_status"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/7"
              />
              <SortableHeader
                label="Ngày đặt"
                field="order_date"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/10"
              />
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, index) => (
              <tr
                key={order.id}
                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewDetail(order.id)}
              >
                <td className="py-2 px-4">
                  {(currentPage - 1) * parPage + index + 1}
                </td>
                <td className="py-2 px-4">{order.receiver_name}</td>
                <td className="py-2 px-4 truncate max-w-xs">
                  {order.address_receiver}
                </td>
                <td className="py-2 px-4">{order.phone_number}</td>
                <td className="py-2 px-4">
                  {parseInt(order.price, 10)?.toLocaleString()}₫
                </td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.order_status === "PAID"
                      ? "bg-[#FF6347] bg-opacity-10 text-[#FF6347] border border-[#FF6347]"
                      : order.order_status === "PREPARING_ORDER"
                      ? "bg-[#FF9800] bg-opacity-10 text-[#FF9800] border border-[#FF9800]"
                      : order.order_status === "ORDER_CANCELED"
                      ? "bg-[#FF0000] bg-opacity-10 text-[#FF0000] border border-[#FF0000]"
                      : order.order_status === "ORDER_RECEIVED"
                      ? "bg-[#9C27B0] bg-opacity-10 text-[#9C27B0] border border-[#9C27B0]"
                      : order.order_status === "DELIVERING"
                      ? "bg-[#2196F3] bg-opacity-10 text-[#2196F3] border border-[#2196F3]"
                      : order.order_status === "ORDER_CONFIRMED"
                      ? "bg-[#28a745] bg-opacity-10 text-[#28a745] border border-[#28a745]"
                      : "bg-[#607D8B] bg-opacity-10 text-[#607D8B] border border-[#607D8B]"
                  }`}>
                    {getStatusText(order.order_status)}
                  </span>
                </td>
                <td className="py-2 px-4">
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
