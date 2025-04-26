import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_coupons, edit_coupon } from "../store/reducers/couponReducer";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import moment from "moment";
import Coupon from "./Coupon";
import { checkCouponStatus } from "../utils/utils";
import toast from "react-hot-toast";

const CouponList = () => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.coupon);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  useEffect(() => {
    dispatch(get_coupons());
  }, [dispatch]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };
  const filteredCoupons = coupons?.filter(
    (coupon) =>
      coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.coupon_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-white rounded-md border border-gray-200 shadow-sm">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Danh Sách Mã Giảm Giá
          </h2>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm mã..."
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
            >
              <FiPlus className="text-xl" />
              <span>Thêm Mã Giảm Giá</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Tên mã</th>
                  <th className="px-6 py-3">Mã giảm giá</th>
                  <th className="px-6 py-3">Loại</th>
                  <th className="px-6 py-3">Giá trị</th>
                  <th className="px-6 py-3">Thời gian</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons?.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{coupon.coupon_name}</td>
                    <td className="px-6 py-4 font-medium">
                      {coupon.coupon_code}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.discount_type === "PERCENTAGE"
                        ? "Phần trăm"
                        : "Số tiền"}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.discount_type === "PERCENTAGE"
                        ? `${coupon.discount_value}%`
                        : `${Number(coupon.discount_value).toLocaleString()}đ`}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p>
                        Từ:{" "}
                        {moment(coupon.start_date).format("DD/MM/YYYY HH:mm")}
                      </p>
                      <p>
                        Đến:{" "}
                        {moment(coupon.end_date).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const status = checkCouponStatus(
                          coupon.start_date,
                          coupon.end_date,
                          coupon.is_active
                        );
                        return (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${status.className}`}
                          >
                            {status.text}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                        onClick={() => handleEdit(coupon)}
                      >
                        Sửa
                      </button>
                      {/* <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Xóa
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal */}
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
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <Coupon
                  onClose={handleCloseModal}
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
