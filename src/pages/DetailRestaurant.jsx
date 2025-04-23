import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  get_restaurant,
  messageClear,
  change_seller_status,
  get_allRestaurant,
} from "../store/reducers/restaurantReducer";
import toast from "react-hot-toast";

const DetailRestaurant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurant, successMessage, errorMessage, loader } = useSelector(
    (state) => state.restaurant
  );
  const { restaurantId } = useParams();

  // Lấy dữ liệu nhà hàng khi component mount
  useEffect(() => {
    if (restaurantId) {
      console.log("Dispatching get_restaurant with ID:", restaurantId);
      dispatch(get_restaurant(restaurantId));
    }
  }, [dispatch, restaurantId]);

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

  // Khi restaurant thay đổi, cập nhật status
  useEffect(() => {
    if (restaurant?.status) {
      console.log("Cập nhật status:", restaurant.status);
      setStatus(restaurant.status);
    }
  }, [restaurant]);

  // Xử lý cập nhật trạng thái
  const submit = (e) => {
    e.preventDefault();

    if (!restaurantId) {
      toast.error("Không tìm thấy ID nhà hàng.");
      return;
    }

    if (status === restaurant.status) {
      toast.error("Nhà hàng đang ở trạng thái này.");
      return;
    }

    dispatch(change_seller_status({ resID: restaurantId }))
      .then(() => {
        toast.success("Cập nhật trạng thái thành công!");
        // Sau khi cập nhật thành công, đóng modal và refresh dữ liệu
        closeOverlayAndRefresh();
      })
      .catch(() => {
        toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
      });
  };

  // Đóng overlay, quay lại trang danh sách và refresh dữ liệu
  const closeOverlayAndRefresh = () => {
    // Dispatch action để tải lại danh sách nhà hàng
    const currentParams = JSON.parse(
      sessionStorage.getItem("restaurantListParams") || "{}"
    );
    dispatch(get_allRestaurant(currentParams));

    // Quay lại trang danh sách
    navigate("/admin/restaurant");
  };

  // Đóng overlay và quay lại trang danh sách
  const closeOverlay = () => {
    closeOverlayAndRefresh();
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Khi component unmount, tải lại danh sách nhà hàng
      const currentParams = JSON.parse(
        sessionStorage.getItem("restaurantListParams") || "{}"
      );
      dispatch(get_allRestaurant(currentParams));
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-[20px] font-bold">Restaurant Details</h1>
          <button
            onClick={closeOverlay}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Hiển thị loading */}
        {loader && (
          <p className="text-center text-blue-500 py-4">Đang tải dữ liệu...</p>
        )}

        <div className="p-4 bg-white">
          <div className="w-full flex flex-col md:flex-row gap-4">
            {/* Ảnh nhà hàng */}
            <div className="md:w-1/3">
              {restaurant?.image ? (
                <img
                  className="w-full h-auto rounded-md"
                  src={restaurant.image}
                  alt={restaurant.name}
                />
              ) : (
                <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center rounded-md">
                  <span>Image Not Uploaded</span>
                </div>
              )}
            </div>

            {/* Thông tin nhà hàng */}
            <div className="md:w-2/3">
              <div className="bg-[#f8f9fa] p-4 rounded-md mb-4">
                <h2 className="text-lg font-semibold mb-2 text-center">
                  Basic Info
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex gap-2">
                    <span className="font-bold">Name:</span>
                    <span>{restaurant?.name || "N/A"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">Time Opening:</span>
                    <div className="flex-1">
                      {restaurant?.opening_hours ? (
                        <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                          {JSON.parse(restaurant.opening_hours).map(
                            (schedule, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-1.5 text-sm border-b border-gray-100 last:border-b-0"
                              >
                                <span className="text-gray-700 font-medium">
                                  {schedule.day}
                                </span>
                                <span className="text-gray-600">
                                  {schedule.open === schedule.close
                                    ? "Đóng cửa"
                                    : `${schedule.open} - ${schedule.close}`}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="font-bold">Phone Number:</span>
                    <span>{restaurant?.phone_number || "N/A"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">Address:</span>
                    <span>{restaurant?.address || "N/A"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">Description:</span>
                    <span>{restaurant?.description || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Form cập nhật trạng thái */}
              <form onSubmit={submit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-white border border-slate-300 rounded-md"
                    required
                  >
                    <option value="">--Select Status--</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailRestaurant;
