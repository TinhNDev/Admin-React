import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  get_driver,
  messageClear,
  change_shipper_status,
  get_allDriver,
} from "../store/reducers/driverReducer";
import toast from "react-hot-toast";

const DetailShipper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { driver, successMessage, errorMessage, loader } = useSelector(
    (state) => state.driver
  );
  const { shipperId } = useParams();
  console.log(driver);

  // Lấy dữ liệu shipper khi component mount
  useEffect(() => {
    if (shipperId) {
      console.log("Dispatching get_driver with ID:", shipperId);
      dispatch(get_driver(shipperId));
    }
  }, [dispatch, shipperId]);

  const [status, setStatus] = useState("");

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-[20px] font-bold">Thông tin chi tiết Shipper</h1>
          <button
            onClick={closeOverlay}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {loader ? (
          <p className="text-center text-blue-500 py-4">Đang tải dữ liệu...</p>
        ) : (
          <div className="p-4 bg-white">
            <div className="w-full flex flex-col md:flex-row gap-4">
              {/* Ảnh và thông tin cơ bản */}
              <div className="md:w-1/3">
                <div className="space-y-4">
                  {/* Ảnh đại diện */}
                  {driver?.Profile?.image ? (
                    <img
                      className="w-full h-auto rounded-lg shadow"
                      src={driver.Profile.image}
                      alt={driver.Profile.name}
                    />
                  ) : (
                    <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center rounded-lg">
                      <span>Chưa có ảnh</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="md:w-2/3 space-y-4">
                {/* Thông tin cá nhân */}
                <div className="bg-[#f8f9fa] p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Thông tin cá nhân
                  </h2>
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
                      <span>{driver?.Profile?.phone_number || "N/A"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium text-gray-600 min-w-[120px]">
                        Ngày sinh:
                      </span>
                      <span>
                        {driver?.dob
                          ? new Date(driver.dob).toLocaleDateString("vi-VN")
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
                <div className="bg-[#f8f9fa] p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Giấy tờ tùy thân
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="font-medium text-gray-600 block mb-2">
                        CCCD Mặt trước:
                      </span>
                      {driver?.cccdFront ? (
                        <img
                          src={driver.cccdFront}
                          alt="CCCD mặt trước"
                          className="w-full h-auto rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                          onClick={() =>
                            window.open(driver.cccdFront, "_blank")
                          }
                        />
                      ) : (
                        <div className="w-full h-[120px] bg-gray-200 flex items-center justify-center rounded-lg">
                          <span className="text-gray-500">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium text-gray-600 block mb-2">
                        CCCD Mặt sau:
                      </span>
                      {driver?.cccdBack ? (
                        <img
                          src={driver.cccdBack}
                          alt="CCCD mặt sau"
                          className="w-full h-auto rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                          onClick={() => window.open(driver.cccdBack, "_blank")}
                        />
                      ) : (
                        <div className="w-full h-[120px] bg-gray-200 flex items-center justify-center rounded-lg">
                          <span className="text-gray-500">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thông tin phương tiện */}
                <div className="bg-[#f8f9fa] p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Thông tin phương tiện
                  </h2>
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
                <div className="bg-[#f8f9fa] p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Giấy đăng ký xe
                  </h2>
                  <div className="space-y-2">
                    {driver?.cavet ? (
                      <img
                        src={driver.cavet}
                        alt="Cà vẹt xe"
                        className="w-full h-auto rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(driver.cavet, "_blank")}
                      />
                    ) : (
                      <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-500">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Trạng thái và cập nhật */}
                <div className="bg-[#f8f9fa] p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Trạng thái
                  </h2>
                  <form onSubmit={submit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-white border border-slate-300 rounded-md flex-1"
                        required
                      >
                        <option value="">Chọn trạng thái</option>
                        <option value="ONLINE">ONLINE</option>
                        <option value="OFFLINE">OFFLINE</option>
                        <option value="BUSY">BUSY</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-6 py-2 transition-colors duration-200"
                      >
                        Cập nhật trạng thái
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailShipper;
