import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_coupons } from "../store/reducers/couponReducer";
import { FiPlus } from "react-icons/fi";
import moment from "moment";
import Coupon from "./Coupon";
import { checkCouponStatus } from "../utils/utils";
import Search from "../components/Search";
import Pagination from "../components/Pagination";

const CouponList = () => {
  const dispatch = useDispatch();
  const { coupons, loader } = useSelector((state) => state.coupon);

  // State cho modal, search, phân trang
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [parPage, setParPage] = useState(5);

  // Lấy danh sách coupon khi load trang
  useEffect(() => {
    dispatch(get_coupons());
  }, [dispatch]);

  // Reset về trang 1 khi search hoặc đổi số lượng/trang
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, parPage]);

  // Lọc coupon theo search term
  const filteredCoupons = coupons?.filter(
    (coupon) =>
      coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.coupon_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang client
  const totalCoupons = filteredCoupons.length;
  const indexOfLastCoupon = currentPage * parPage;
  const indexOfFirstCoupon = indexOfLastCoupon - parPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  // Xử lý modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[#000000] font-semibold text-4xl mb-3">Mã Giảm Giá</h1>

      <div className='flex justify-between items-center'>
          {/* Search + chọn số lượng/trang */}
          <div className="mb-4 flex items-center gap-4">
            <Search
              setParPage={setParPage}
              setSearchValue={setSearchTerm}
              searchValue={searchTerm}
              placeholder="Tìm kiếm mã giảm giá..."
            />
          </div>

          {/* Nút thêm coupon */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
            >
              <FiPlus className="text-xl" />
              <span>Thêm Mã Giảm Giá</span>
            </button>
          </div>
      </div>

      {/* Bảng hiển thị */}
      <div className="relative overflow-x-auto mt-5">
        {loader ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <table className="w-full text-base text-left text-gray-700 bg-white">
            <thead className="text-sm text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-4">Tên mã</th>
                <th className="py-3 px-4">Mã giảm giá</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">Giá trị</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentCoupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="bg-white border-b hover:bg-blue-200 cursor-pointer transition"
                  onClick={() => handleEdit(coupon)}
                >
                  <td className="py-2 px-4 font-medium text-xl">{coupon.coupon_name}</td>
                  <td className="py-2 px-4 font-medium text-xl">{coupon.coupon_code}</td>
                  <td className="py-2 px-4 font-medium text-xl">
                    {coupon.discount_type === "PERCENTAGE" ? "Phần trăm" : "Số tiền"}
                  </td>
                  <td className="py-2 px-4 font-medium text-xl">
                    {coupon.discount_type === "PERCENTAGE"
                      ? `${coupon.discount_value}%`
                      : `${Number(coupon.discount_value).toLocaleString()}đ`}
                  </td>
                  <td className="py-2 px-4 font-medium text-sm">
                    <p>Từ: {moment(coupon.start_date).format("DD/MM/YYYY HH:mm")}</p>
                    <p>Đến: {moment(coupon.end_date).format("DD/MM/YYYY HH:mm")}</p>
                  </td>
                  <td className="py-2 px-4 font-medium text-xl">
                    <span className={`px-2 py-1 rounded-full text-sm ${checkCouponStatus(coupon.start_date, coupon.end_date, coupon.is_active).className}`}>
                      {checkCouponStatus(coupon.start_date, coupon.end_date, coupon.is_active).text}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-end mt-4 bottom-4 right-4">
        <Pagination
          pageNumber={currentPage}
          setPageNumber={setCurrentPage}
          totalItem={totalCoupons}
          parPage={parPage}
          showItem={3}
        />
      </div>

      {/* Modal thêm/chỉnh sửa coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto">
              <div className="flex justify-end p-2">
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <Coupon
                  onClose={handleCloseModal}
                  onSuccess={() => {
                    dispatch(get_coupons());
                    handleCloseModal();
                  }}
                  editData={editingCoupon}
                  isEditing={!!editingCoupon}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponList;
