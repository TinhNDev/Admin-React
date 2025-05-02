import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  get_driver,
  messageClear,
  change_shipper_status,
  get_allDriver,
  get_shipper_orders,
  get_driver_reviews,
} from "../store/reducers/driverReducer";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import OrderList from "./OrderList";
import ReviewList from "./ReviewList";
const DetailShipper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { driver, orders, reviews, successMessage, errorMessage, loader } =
    useSelector((state) => state.driver);
  const { shipperId } = useParams();

  // Lấy dữ liệu shipper khi component mount
  useEffect(() => {
    if (shipperId) {
      dispatch(get_driver(shipperId));
    }
  }, [dispatch, shipperId]);

  // Lấy danh sách đơn hàng của shipper
  useEffect(() => {
    if (shipperId) {
      dispatch(get_shipper_orders(shipperId));
    }
  }, [dispatch, shipperId]);
  useEffect(() => {
    if (shipperId) {
      dispatch(get_driver_reviews(shipperId));
    }
  }, [dispatch, shipperId]);
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  // Hiển thị thông báo khi có successMessage hoặc errorMessage
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Khi driver thay đổi, cập nhật status
  useEffect(() => {
    if (driver?.status) {
      console.log("Cập nhật status:", driver.status);
      setStatus(driver.status);
    }
  }, [driver]);

  // Xử lý cập nhật trạng thái
  const submit = (e) => {
    e.preventDefault();

    if (!shipperId) {
      toast.error("Không tìm thấy ID shipper.");
      return;
    }

    if (status === driver.status) {
      toast.error("Shipper đang ở trạng thái này.");
      return;
    }

    dispatch(change_shipper_status({ driverId: shipperId, status }))
      .then(() => {
        toast.success("Cập nhật trạng thái thành công!");
        closeOverlayAndRefresh();
      })
      .catch(() => {
        toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
      });
  };

  // Đóng overlay, quay lại trang danh sách và refresh dữ liệu
  const closeOverlayAndRefresh = () => {
    // Dispatch action để tải lại danh sách shipper
    const currentParams = JSON.parse(
      sessionStorage.getItem("driverListParams") || "{}"
    );
    dispatch(get_allDriver(currentParams));

    // Quay lại trang danh sách
    navigate("/admin/shipper");
  };

  // Đóng overlay và quay lại trang danh sách
  const closeOverlay = () => {
    closeOverlayAndRefresh();
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Khi component unmount, tải lại danh sách shipper
      const currentParams = JSON.parse(
        sessionStorage.getItem("driverListParams") || "{}"
      );
      dispatch(get_allDriver(currentParams));
    };
  }, []);

  const handleBack = () => {
    navigate("/admin/shipper");
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-white rounded-lg shadow">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết Shipper
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 ${
              activeTab === "info"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-600"
            }`}
          >
            Thông tin
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 ${
              activeTab === "orders"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-600"
            }`}
          >
            Đơn hàng
          </button>
        </div>

        {loader ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {activeTab === "info" ? (
              <div>
                <div className="flex flex-col md:flex-row gap-6 mb-4">
                  <div className="w-full flex flex-col md:flex-row gap-6">
                    {/* Ảnh và thông tin cơ bản */}
                    <div className="md:w-1/3">
                      <div className="space-y-4">
                        {/* Ảnh đại diện */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <h3 className="text-lg font-medium mb-3 text-gray-800">
                            Ảnh đại diện
                          </h3>
                          {driver?.Profile?.image ? (
                            <img
                              className="w-full h-auto rounded-lg shadow-sm"
                              src={driver.Profile.image}
                              alt={driver.Profile.name}
                            />
                          ) : (
                            <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center rounded-lg">
                              <span className="text-gray-400">Chưa có ảnh</span>
                            </div>
                          )}
                        </div>

                        {/* Status Update Card */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <h3 className="text-lg font-medium mb-3 text-gray-800">
                            Cập nhật trạng thái
                          </h3>
                          <form onSubmit={submit} className="space-y-3">
                            <select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 text-sm"
                              required
                            >
                              <option value="">Chọn trạng thái</option>
                              <option value="ONLINE">ONLINE</option>
                              <option value="LOCKED">LOCKED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="BUSY">BUSY</option>
                            </select>
                            <button
                              type="submit"
                              className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-medium"
                            >
                              Cập nhật
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="md:w-2/3 space-y-4">
                      {/* Thông tin cá nhân */}
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-3 text-gray-800">
                          Thông tin cá nhân
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[120px]">
                              Họ và tên:
                            </span>
                            <span>{driver?.Profile?.name || "N/A"}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[120px]">
                              Số điện thoại:
                            </span>
                            <span>
                              {driver?.Profile?.phone_number || "N/A"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[120px]">
                              Ngày sinh:
                            </span>
                            <span>
                              {driver?.dob
                                ? new Date(driver.dob).toLocaleDateString(
                                    "vi-VN"
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[120px]">
                              CCCD:
                            </span>
                            <span>{driver?.cic || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      {/* CCCD Images */}
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-3 text-gray-800">
                          Căn cước công dân
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="font-medium text-gray-600 block mb-2">
                              Mặt trước:
                            </span>
                            {driver?.cccdFront ? (
                              <img
                                src={driver.cccdFront}
                                alt="CCCD mặt trước"
                                className="w-9/12 h-auto rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                                onClick={() =>
                                  window.open(driver.cccdFront, "_blank")
                                }
                              />
                            ) : (
                              <div className="w-9/12 h-[120px] bg-gray-100 flex items-center justify-center rounded-lg">
                                <span className="text-gray-400">
                                  Chưa có ảnh
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <span className="font-medium text-gray-600 block mb-2">
                              Mặt sau:
                            </span>
                            {driver?.cccdBack ? (
                              <img
                                src={driver.cccdBack}
                                alt="CCCD mặt sau"
                                className="w-9/12 h-auto rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                                onClick={() =>
                                  window.open(driver.cccdBack, "_blank")
                                }
                              />
                            ) : (
                              <div className="w-9/12 h-[120px] bg-gray-100 flex items-center justify-center rounded-lg">
                                <span className="text-gray-400">
                                  Chưa có ảnh
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Thông tin phương tiện */}
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-3 text-gray-800">
                          Thông tin phương tiện
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[120px]">
                              Loại xe:
                            </span>
                            <span>{driver?.car_name || "N/A"}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[120px]">
                              Biển số:
                            </span>
                            <span>{driver?.license_plate || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Registration */}
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-3 text-gray-800">
                          Giấy đăng ký xe
                        </h3>
                        <div className="flex justify-center items-center">
                          {driver?.cavet ? (
                            <img
                              src={driver.cavet}
                              alt="Cà vẹt xe"
                              className="w-6/12 h-auto rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                              onClick={() =>
                                window.open(driver.cavet, "_blank")
                              }
                            />
                          ) : (
                            <div className="w-6/12 h-[120px] bg-gray-100 flex items-center justify-center rounded-lg">
                              <span className="text-gray-400">Chưa có ảnh</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <ReviewList reviews={reviews} type="driver" />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                {orders?.length > 0 ? (
                  <OrderList orders={orders} userType="shipper" />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <p className="mt-2 text-sm font-medium">
                      Chưa có đơn hàng nào
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DetailShipper;
