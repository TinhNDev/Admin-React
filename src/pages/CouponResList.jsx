import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CouponResList = ({ coupons }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 px-4 pt-4">Danh sách mã giảm giá của nhà hàng</h2>
      <table className="w-full text-base text-gray-700">
        <thead className="bg-gray-100 text-base uppercase border-b">
          <tr>
            <th className="py-3 px-4 text-center">ID</th>
            <th className="py-3 px-4 text-left">Tên mã</th>
            <th className="py-3 px-4 text-left">Mã code</th>
            <th className="py-3 px-4 text-center">Giá trị</th>
            <th className="py-3 px-4 text-center">Loại giảm</th>
            <th className="py-3 px-4 text-center">Giảm tối đa</th>
            <th className="py-3 px-4 text-center">Đơn tối thiểu</th>
            <th className="py-3 px-4 text-center">Số lần/user</th>
            <th className="py-3 px-4 text-center">Đã dùng</th>
            <th className="py-3 px-4 text-center">Ngày bắt đầu</th>
            <th className="py-3 px-4 text-center">Ngày kết thúc</th>
            <th className="py-3 px-4 text-center">Kích hoạt</th>
            <th className="py-3 px-4 text-center">Loại mã</th>
          </tr>
        </thead>
        <tbody>
          {coupons && coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr key={coupon.id} className="bg-white border-b hover:bg-blue-100 cursor-pointer transition">
                <td className="py-2 px-4 text-center font-medium">{coupon.id}</td>
                <td className="py-2 px-4 text-left">{coupon.coupon_name}</td>
                <td className="py-2 px-4 text-left">{coupon.coupon_code}</td>
                <td className="py-2 px-4 text-center">
                  {coupon.discount_type === "PERCENTAGE"
                    ? `${coupon.discount_value}%`
                    : `${Number(coupon.discount_value).toLocaleString()}đ`}
                </td>
                <td className="py-2 px-4 text-center">
                  {coupon.discount_type === "PERCENTAGE" ? "Phần trăm" : "Số tiền"}
                </td>
                <td className="py-2 px-4 text-center">{Number(coupon.max_discount_amount).toLocaleString()}đ</td>
                <td className="py-2 px-4 text-center">{Number(coupon.min_order_value).toLocaleString()}đ</td>
                <td className="py-2 px-4 text-center">{coupon.max_uses_per_user}</td>
                <td className="py-2 px-4 text-center">{coupon.current_uses}</td>
                <td className="py-2 px-4 text-center">{formatDate(coupon.start_date)}</td>
                <td className="py-2 px-4 text-center">{formatDate(coupon.end_date)}</td>
                <td className="py-2 px-4 text-center">
                  {coupon.is_active ? (
                    <span className="text-green-600 font-semibold">Đang bật</span>
                  ) : (
                    <span className="text-gray-400">Tắt</span>
                  )}
                </td>
                <td className="py-2 px-4 text-center">{coupon.coupon_type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={13} className="text-center py-4 text-gray-500">
                Không có mã giảm giá nào cho nhà hàng này.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CouponResList;
