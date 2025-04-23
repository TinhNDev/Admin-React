import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { Link, Outlet } from "react-router-dom";
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
        return "Đã thanh toán";
      case "UNPAID":
        return "Chưa thanh toán";
      case "PREPARING_ORDER":
        return "Đang chuẩn bị";
      case "ORDER_CANCELED":
        return "Đã hủy";
      case "ORDER_RECEIVED":
        return "Đã nhận đơn";
      case "DELIVERING":
        return "Đang giao hàng";
      case "ORDER_CONFIRMED":
        return "Đã xác nhận";
      default:
        return status;
    }
  };
  const getSortedData = () => {
    if (!sortField) return orders;

    return [...orders].sort((a, b) => {
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
  };

  const sortedOrders = getSortedData();

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-black font-semibold text-lg mb-3">All Orders</h1>

      <Search
        setParPage={setParPage}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
      />

      <div className="relative overflow-x-auto mt-5">
        <table className="w-full text-sm text-left text-gray-700 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
            <tr>
              <SortableHeader
                label="No"
                field="id"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-12"
              />
              <SortableHeader
                label="Receiver"
                field="receiver_name"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6"
              />
              <SortableHeader
                label="Address"
                field="address_receiver"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/4"
              />
              <SortableHeader
                label="Phone"
                field="phone_number"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6"
              />
              <SortableHeader
                label="Total Price"
                field="price"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6"
              />
              <SortableHeader
                label="Status"
                field="order_status"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6"
              />
              <SortableHeader
                label="Order Date"
                field="order_date"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6"
              />
              <th className="py-3 px-4 w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, index) => (
              <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.order_status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : order.order_status === "UNPAID"
                        ? "bg-red-100 text-red-800"
                        : order.order_status === "PREPARING_ORDER"
                        ? "bg-blue-100 text-blue-800"
                        : order.order_status === "ORDER_CANCELED"
                        ? "bg-red-100 text-red-800"
                        : order.order_status === "ORDER_RECEIVED"
                        ? "bg-purple-100 text-purple-800"
                        : order.order_status === "DELIVERING"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.order_status === "ORDER_CONFIRMED"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getStatusText(order.order_status)}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/order/details/${order.id}`}
                      className="p-[5px] bg-green-500 text-white rounded hover:shadow-lg hover:shadow-green-500/50"
                    >
                      <FaEye size={14} />
                    </Link>
                    <button className="p-[5px] bg-red-500 text-white rounded hover:shadow-lg hover:shadow-red-500/50">
                      <FaTrash size={14} />
                    </button>
                  </div>
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
