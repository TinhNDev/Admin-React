import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { Outlet, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetch_feedbacks } from "../store/reducers/feedbackReducer";
import SortableHeader from "../components/SortableHeader";

const Feedback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { feedbacks, loader, errorMessage } = useSelector(
    (state) => state.feedback
  );

  useEffect(() => {
    dispatch(fetch_feedbacks());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [parPage, searchValue]);

  // Search & sort
  const getFilteredSortedFeedbacks = () => {
    let data = Array.isArray(feedbacks) ? [...feedbacks] : [];

    // Search
    if (searchValue) {
      data = data.filter(
        (fb) =>
          (fb.name &&
            fb.name.toLowerCase().includes(searchValue.toLowerCase())) ||
          (fb.content &&
            fb.content.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    // Sort nếu có
    if (sortField) {
      data.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        if (sortField === "createdAt") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
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

  const filteredSortedFeedbacks = getFilteredSortedFeedbacks();

  // ĐẢO NGƯỢC: feedback mới nhất lên đầu
  const reversedFeedbacks = [...filteredSortedFeedbacks].reverse();

  // PHÂN TRANG
  const startIndex = (currentPage - 1) * parPage;
  const endIndex = startIndex + parPage;
  const displayedFeedbacks = reversedFeedbacks.slice(startIndex, endIndex);

  // Điều hướng đến trang chi tiết feedback sử dụng id
  const handleViewDetail = (feedbackId) => {
    navigate(`/admin/feedback/${feedbackId}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[#000000] font-semibold text-4xl mb-3">
        Danh sách Phản hồi
      </h1>
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
                Người gửi
              </th>
              <SortableHeader
                label="Nội dung"
                field="content"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/3 text-base"
              />
              <SortableHeader
                label="Trạng thái"
                field="is_checked"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6 text-base"
              />
              <SortableHeader
                label="Ngày gửi"
                field="createdAt"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="w-1/6 text-base"
              />
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <tr>
                <td colSpan="5" className="py-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-red-500">
                  {errorMessage}
                </td>
              </tr>
            ) : displayedFeedbacks.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  Không có phản hồi nào
                </td>
              </tr>
            ) : (
              displayedFeedbacks.map((fb, index) => (
                <tr
                  key={fb.id}
                  className="bg-white border-b hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleViewDetail(fb.id)}
                >
                  <td className="py-2 px-4 font-medium text-xl">
                    {startIndex + index + 1}
                  </td>
                  <td className="py-2 px-4 font-medium text-xl">
                    {fb.name || "Khách hàng"}
                  </td>
                  <td className="py-2 px-4 font-medium text-xl truncate max-w-xs">
                    {fb.content}
                  </td>
                  <td className="py-2 px-4 font-medium text-xl">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        fb.is_checked
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {fb.is_checked ? "Đã xem" : "Chưa xem"}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-medium text-xl">
                    {fb.createdAt
                      ? new Date(fb.createdAt).toLocaleDateString()
                      : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Outlet />
      <div className="w-full flex justify-end mt-4 bottom-4 right-4">
        <Pagination
          pageNumber={currentPage}
          setPageNumber={setCurrentPage}
          totalItem={filteredSortedFeedbacks.length}
          parPage={parPage}
          showItem={3}
        />
      </div>
    </div>
  );
};

export default Feedback;
