import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { Link, Outlet } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_allDriver } from "../store/reducers/driverReducer";
import SortableHeader from "../components/SortableHeader";

const Shipper = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { drivers, totalDrivers } = useSelector((state) => state.driver);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      search: searchValue,
      sortField,
      sortOrder,
    };
    dispatch(get_allDriver(obj));
  }, [searchValue, currentPage, parPage, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    let data = [...drivers];
    if (sortField) {
      data.sort((a, b) => {
        let valueA, valueB;
        if (sortField === "name" || sortField === "phone_number") {
          valueA = a.Profile?.[sortField] || "";
          valueB = b.Profile?.[sortField] || "";
        } else {
          valueA = a[sortField];
          valueB = b[sortField];
        }
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

  const sortedDrivers = getSortedData();

  // Tăng size chữ với text-lg
  const cellClass =
    "py-2 px-4 font-semibold capitalize text-lg cursor-pointer hover:bg-blue-50 transition";

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[#000000] font-semibold text-4xl mb-3">Danh sách tài xế</h1>
      <div className="w-full p-4 bg-white rounded-md shadow-sm">
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
                className="w-24 text-lg" // NO rộng hơn
              />
              <th scope="col" className="py-3 px-4 w-32 text-lg">
                Hình ảnh
              </th>
              <SortableHeader
                label="Tên"
                field="name"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/5 text-lg"
              />
              <SortableHeader
                label="Trạng thái"
                field="status"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/5 text-lg"
              />
              <SortableHeader
                label="Điện thoại"
                field="phone_number"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/5 text-lg"
              />
              <SortableHeader
                label="Biển số xe"
                field="license_plate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-24 text-base" // Biển số xe nhỏ lại
              />
              <SortableHeader
                label="Tên xe"
                field="car_name"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-24 text-base" // Tên xe nhỏ lại
              />
            </tr>
          </thead>
          <tbody>
            {sortedDrivers.map((dri, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <Link to={`/admin/shipper/${dri.id}`} className="contents">
                  <td className={cellClass + " w-24"}>
                    {(currentPage - 1) * parPage + index + 1}
                  </td>
                  <td className="py-2 px-4 w-32">
                    <img
                      className="w-[70px] h-[70px] rounded-full object-cover"
                      src={dri.Profile?.image}
                      alt=""
                    />
                  </td>
                  <td className={cellClass}>{dri.Profile?.name}</td>
                  <td className={cellClass}>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        dri.status === "BUSY"
                          ? "bg-green-100 text-green-800"
                          : dri.status === "PROCESSING"
                          ? "bg-yellow-100 text-yellow-800"
                          : dri.status === "ONLINE"
                          ? "bg-yellow-100 text-blue-500"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dri.status || "N/A"}
                    </span>
                  </td>
                  <td className={cellClass}>{dri.Profile?.phone_number}</td>
                  <td className={cellClass + " w-24 text-base"}>{dri.license_plate}</td>
                  <td className={cellClass + " w-24 text-base"}>{dri.car_name}</td>
                </Link>
              </tr>
            ))}
          </tbody>

          </table>
        </div>
        <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalDrivers}
            parPage={parPage}
            showItem={3}
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Shipper;
