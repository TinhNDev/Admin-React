import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  create_coupon,
  messageClear,
  edit_coupon,
} from "../store/reducers/couponReducer";
import toast from "react-hot-toast";
const formatDateTimeForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().slice(0, 16);
};
const Coupon = ({ onClose, editData, isEditing }) => {
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.coupon
  );
  const { userInfo } = useSelector((state) => state.auth);

  const initialState = {
    coupon_name: "",
    coupon_code: "",
    discount_value: "",
    discount_type: "PERCENTAGE",
    max_discount_amount: "",
    min_order_value: "",
    max_uses_per_user: "",
    start_date: "",
    end_date: "",
    is_active: true,
    coupon_type: "ONE_TIME",
  };

  const [formData, setFormData] = useState(initialState);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage); // Hiện toast thành công
      dispatch(messageClear());
      onClose && onClose(); // Đóng form nếu có

    }
    if (errorMessage) {
      toast.error(errorMessage); // Hiện toast lỗi
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, onClose]);
  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        start_date: formatDateTimeForInput(editData.start_date),
        end_date: formatDateTimeForInput(editData.end_date),
      });
    }
  }, [editData]);
  // Monitor notifications from Redux store
  useEffect(() => {
    if (successMessage) {
      dispatch(messageClear());
      onClose && onClose();
    }
    if (errorMessage) {
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.coupon_name) {
      toast.error("Vui lòng nhập tên mã giảm giá");
      return false;
    }
    if (!formData.coupon_code) {
      toast.error("Vui lòng nhập mã giảm giá");
      return false;
    }
    if (!formData.discount_value) {
      toast.error("Vui lòng nhập giá trị giảm");
      return false;
    }
    if (parseFloat(formData.discount_value) <= 0) {
      toast.error("Giá trị giảm phải lớn hơn 0");
      return false;
    }
    if (!formData.start_date) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return false;
    }
    if (!formData.end_date) {
      toast.error("Vui lòng chọn ngày kết thúc");
      return false;
    }

    // Check start and end dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const currentDate = new Date();

    if (startDate < currentDate) {
      toast.error("Ngày bắt đầu phải từ ngày hiện tại trở đi");
      return false;
    }
    if (endDate <= startDate) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return false;
    }

    // Check numeric values
    // Kiểm tra giảm tối đa (max_discount_amount)
    if (formData.max_discount_amount) {
      const maxDiscount = Number(formData.max_discount_amount);
      if (maxDiscount <= 1000) {
        toast.error("Giá trị giảm tối đa phải lớn hơn 1000");
        return false;
      }
      if (maxDiscount % 1000 !== 0) {
        // Gợi ý 2 giá trị gần nhất
        const lower = Math.floor(maxDiscount / 1000) * 1000;
        const higher = lower + 1000;
        toast.error(
          `Vui lòng nhập bội số của 1000. Hai giá trị gần nhất là ${lower.toLocaleString()} và ${higher.toLocaleString()}`
        );
        return false;
      }
    }

    // Kiểm tra giá trị đơn hàng tối thiểu (min_order_value)
    if (formData.min_order_value) {
      const minOrder = Number(formData.min_order_value);
      if (minOrder <= 0) {
        toast.error("Giá trị đơn hàng tối thiểu phải lớn hơn 0");
        return false;
      }
      if (minOrder % 1000 !== 0) {
        const lower = Math.floor(minOrder / 1000) * 1000;
        const higher = lower + 1000;
        toast.error(
          `Vui lòng nhập bội số của 1000. Hai giá trị gần nhất là ${lower.toLocaleString()} và ${higher.toLocaleString()}`
        );
        return false;
      }
    }
    if (
      formData.max_uses_per_user &&
      parseInt(formData.max_uses_per_user) <= 0
    ) {
      toast.error("Số lần sử dụng tối đa phải lớn hơn 0");
      return false;
    }

    // Check percentage value
    if (
      formData.discount_type === "PERCENTAGE" &&
      parseFloat(formData.discount_value) > 100
    ) {
      toast.error("Giá trị phần trăm giảm không được vượt quá 100%");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("userToken");
    const adminId = userInfo?.user_id || localStorage.getItem("adminId");

    if (!token || !adminId) {
      toast.error("Bạn cần đăng nhập lại để thực hiện chức năng này");
      return;
    }

    const body = {
      ...formData,
      discount_value: parseFloat(formData.discount_value),
      max_discount_amount: formData.max_discount_amount
        ? parseFloat(formData.max_discount_amount)
        : undefined,
      min_order_value: formData.min_order_value
        ? parseFloat(formData.min_order_value)
        : undefined,
      max_uses_per_user: formData.max_uses_per_user
        ? parseInt(formData.max_uses_per_user)
        : undefined,
    };

    if (isEditing) {
      dispatch(edit_coupon({ body }));
    } else {
      dispatch(create_coupon({ body }));
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 sticky top-0 bg-white z-10">
        {isEditing ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
      </h2>

      <form onSubmit={handleSubmit} className="px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên mã giảm giá */}
          <div className="space-y-1.5">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="coupon_name"
            >
              Tên mã giảm giá <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="coupon_name"
              name="coupon_name"
              value={formData.coupon_name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              placeholder="Nhập tên mã giảm giá"
              required
            />
          </div>

          {/* Mã giảm giá */}
          <div className="space-y-2">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="coupon_code"
            >
              Mã giảm giá <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="coupon_code"
              name="coupon_code"
              value={formData.coupon_code}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              placeholder="Ví dụ: SUMMER2023"
              required
            />
          </div>

          {/* Loại giảm giá */}
          <div className="space-y-2">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="discount_type"
            >
              Loại giảm giá <span className="text-red-500">*</span>
            </label>
            <select
              id="discount_type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              required
            >
              <option value="PERCENTAGE">Phần trăm (%)</option>
              <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
            </select>
          </div>

          {/* Giá trị giảm */}
          <div className="space-y-2">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="discount_value"
            >
              Giá trị giảm <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="discount_value"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              placeholder={
                formData.discount_type === "PERCENTAGE"
                  ? "Nhập % giảm giá"
                  : "Nhập số tiền giảm"
              }
              min="0"
              step={formData.discount_type === "PERCENTAGE" ? "0.1" : "1000"}
              required
            />
            <span className="text-sm text-gray-500">
              {formData.discount_type === "PERCENTAGE"
                ? "Giá trị từ 0-100%"
                : "Số tiền (VNĐ)"}
            </span>
          </div>

          {/* Giảm tối đa */}
          {formData.discount_type === "PERCENTAGE" && (
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-lg font-semibold"
                htmlFor="max_discount_amount"
              >
                Giảm tối đa (VNĐ)
              </label>
              <input
                type="number"
                id="max_discount_amount"
                name="max_discount_amount"
                value={formData.max_discount_amount}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
                placeholder="Nhập số tiền giảm tối đa"
                min="0"
                step="1000"
              />
              <span className="text-sm text-gray-500">
                Để trống nếu không giới hạn
              </span>
            </div>
          )}

          {/* Giá trị đơn hàng tối thiểu */}
          <div className="space-y-2">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="min_order_value"
            >
              Giá trị đơn hàng tối thiểu (VNĐ)
            </label>
            <input
              type="number"
              id="min_order_value"
              name="min_order_value"
              value={formData.min_order_value}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              placeholder="Nhập giá trị đơn hàng tối thiểu"
              min="0"
              step="1000"
            />
            <span className="text-sm text-gray-500">
              Để trống nếu không yêu cầu tối thiểu
            </span>
          </div>

          {/* Số lần sử dụng tối đa */}
          <div className="space-y-2">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="max_uses_per_user"
            >
              Số lần sử dụng tối đa
            </label>
            <input
              type="number"
              id="max_uses_per_user"
              name="max_uses_per_user"
              value={formData.max_uses_per_user}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              placeholder="Nhập số lần sử dụng tối đa"
              min="1"
              step="1"
            />
            <span className="text-sm text-gray-500">
              Để trống nếu không giới hạn
            </span>
          </div>

          {/* Loại mã */}
          <div className="space-y-2">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="coupon_type"
            >
              Loại mã <span className="text-red-500">*</span>
            </label>
            <select
              id="coupon_type"
              name="coupon_type"
              value={formData.coupon_type}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              required
            >
              <option value="ONE_TIME">Sử dụng một lần</option>
              <option value="ONE_TIME_EVERY_DAY">
                Sử dụng mỗi ngày một lần
              </option>
            </select>
          </div>

          {/* Ngày bắt đầu */}
          <div className="space-y-2">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="start_date"
            >
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              required
            />
          </div>

          {/* Ngày kết thúc */}
          <div className="space-y-2">
            <label
              className="block text-gray-700 text-lg font-semibold"
              htmlFor="end_date"
            >
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
              required
            />
          </div>
        </div>

        {/* Trạng thái kích hoạt */}
        <div className="mt-4">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-400 transition duration-200"
            />
            <span className="text-gray-700 text-base font-semibold group-hover:text-orange-600 transition duration-200">
              Kích hoạt ngay
            </span>
          </label>
        </div>

        {/* Nút tạo mã */}
        <div className="flex justify-end mt-6 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 mr-3"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loader}
            className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg 
                     hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 
                     focus:ring-offset-2 transition duration-200
                     disabled:opacity-70 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {loader ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : isEditing ? (
              "Cập nhật mã giảm giá"
            ) : (
              "Tạo mã giảm giá"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Coupon;
