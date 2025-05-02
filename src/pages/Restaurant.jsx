import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import {  Outlet, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_allRestaurant } from "../store/reducers/restaurantReducer";
import SortableHeader from "../components/SortableHeader";

const Restaurant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { restaurants, totalRestaurant } = useSelector(
    (state) => state.restaurant
  );

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      search: searchValue,
      sortField,
      sortOrder,
    };
    dispatch(get_allRestaurant(obj));
  }, [ currentPage, parPage, sortField, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [parPage, searchValue]);

  const handleViewDetail = (restaurantId) => {
    navigate(`/admin/restaurant/${restaurantId}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    let data = [...restaurants];

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

    const startIndex = (currentPage - 1) * parPage;
    const endIndex = startIndex + parPage;
    return data.slice(startIndex, endIndex);
  };

  const sortedRestaurants = getSortedData();

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[#000000] font-semibold text-4xl mb-3">Danh sách nhà hàng</h1>
      <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
      <div className="relative overflow-x-auto mt-5">
        <table className="w-full text-base text-left text-gray-700 bg-white">
          <thead className="text-sm text-gray-700 uppercase bg-gray-100 border-b">
            <tr>
              <SortableHeader
                label="No"
                field="id"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-14"
              />
              <th scope="col" className="py-3 px-4 w-16 text-base">
                Hình ảnh
              </th>
              <SortableHeader
                label="Tên"
                field="name"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/5 text-base"
              />
              <SortableHeader
                label="Điện thoại"
                field="phone_number"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6 text-base"
              />
              <SortableHeader
                label="Trạng thái"
                field="status"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6 text-base"
              />
              <SortableHeader
                label="Địa chỉ"
                field="address"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/3 text-base"
              />
              {/* Bỏ cột "Chức năng" ở đây */}
            </tr>
          </thead>
          <tbody>
            {sortedRestaurants.map((res, index) => (
              <tr
                key={index}
                className="bg-white border-b hover:bg-blue-300 cursor-pointer"
                onClick={() => handleViewDetail(res.id)}
              >
                <td className="py-2 px-4 font-medium text-xl">
                  {(currentPage - 1) * parPage + index + 1}
                </td>
                <td className="py-2 px-4 font-medium text-xl">
                  <img
                    className="w-[45px] h-[45px] rounded-full object-cover"
                    src={res.image}
                    alt=""
                  />
                </td>
                <td className="py-2 px-4 font-medium text-xl">{res.name}</td>
                <td className="py-2 px-4 font-medium text-xl">
                  {res.phone_number}
                </td>
                <td className="py-2 px-4 font-medium text-xl">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      res.status === "active"
                        ? "bg-green-100 text-green-800"
                        : res.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {res.status || "N/A"}
                  </span>
                </td>
                <td className="py-2 px-4 font-medium truncate max-w-xs text-base">
                  {res.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />
      <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalRestaurant}
            parPage={parPage}
            showItem={3}
          />
        </div>
    </div>
  );
};

export default Restaurant;
