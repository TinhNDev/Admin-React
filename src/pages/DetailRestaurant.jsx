import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  get_restaurant,
  messageClear,
  change_seller_status,
  get_allRestaurant,
  get_restaurant_products,
  get_restaurant_reviews,
} from "../store/reducers/restaurantReducer";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import ProductList from "./ProductList";
import ReviewList from "./ReviewList";
const DetailRestaurant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    restaurant,
    products,
    get_orderRes,
    reviews,
    successMessage,
    errorMessage,
    loader,
  } = useSelector((state) => state.restaurant);

  const { restaurantId } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  // Lấy dữ liệu nhà hàng khi component mount
  useEffect(() => {
    if (restaurantId) {
      console.log("Dispatching get_restaurant with ID:", restaurantId);
      dispatch(get_restaurant(restaurantId));
    }
  }, [dispatch, restaurantId]);
  useEffect(() => {
    if (activeTab === "products" && restaurantId) {
      dispatch(get_restaurant_products({ restaurantId }));
    }
  }, [activeTab, restaurantId]);
  useEffect(() => {
    if (activeTab === "orders" && restaurantId) {
      dispatch(get_orderRes({ restaurantId }));
    }
  }, [activeTab, restaurantId, dispatch]);
  useEffect(() => {
    if (restaurantId) {
      dispatch(get_restaurant_reviews(restaurantId));
    }
  }, [dispatch, restaurantId]);
  useEffect(() => {
    dispatch(
      get_restaurant_products({
        restaurantId,
      })
    );
  }, [dispatch]);
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
      })
      .catch(() => {
        toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
      });
  };

  const handleBack = () => {
    navigate(-1);
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
            Chi tiết nhà hàng
          </h2>
        </div>
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
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 ${
              activeTab === "products"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-600"
            }`}
          >
            Sản phẩm
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
        {activeTab === "info" ? (
          <>
            {loader && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-orange-500 border-t-transparent"></div>
              </div>
            )}

            {!loader && restaurant && (
              <>
                <div className="w-full flex flex-col md:flex-row gap-4">
                  {/* Left column - Image */}
                  <div className="md:w-1/4">
                    {restaurant?.image ? (
                      <img
                        className="w-full h-auto rounded-lg shadow-sm"
                        src={restaurant.image}
                        alt={restaurant.name}
                      />
                    ) : (
                      <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Chưa có ảnh</span>
                      </div>
                    )}
                    {/* Status Update Card */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3 text-gray-800">
                        Cập nhật trạng thái
                      </h3>
                      <form onSubmit={submit} className="flex gap-3">
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 text-sm"
                          required
                        >
                          <option value="">Chọn trạng thái</option>
                          <option value="active">Hoạt động</option>
                          <option value="pending">Chờ duyệt</option>
                        </select>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
                        >
                          Cập nhật
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right column - Information */}
                  <div className="md:w-3/4 space-y-4">
                    {/* Basic Info Card */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3 text-gray-800">
                        Thông tin cơ bản
                      </h3>
                      <div className="grid gap-3">
                        <div className="flex gap-3">
                          <span className="font-medium text-gray-600 w-28">
                            Tên:
                          </span>
                          <span>{restaurant?.name || "N/A"}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-medium text-gray-600 w-32">
                            Số điện thoại:
                          </span>
                          <span>{restaurant?.phone_number || "N/A"}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-medium text-gray-600 w-32">
                            Địa chỉ:
                          </span>
                          <span>{restaurant?.address || "N/A"}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-medium text-gray-600 w-32">
                            Mô tả:
                          </span>
                          <span>{restaurant?.description || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Opening Hours Card */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3 text-gray-800">
                        Giờ mở cửa
                      </h3>
                      {restaurant?.opening_hours ? (
                        <div className="grid gap-2">
                          {JSON.parse(restaurant.opening_hours).map(
                            (schedule, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-1.5 border-b last:border-0 text-sm"
                              >
                                <span className="font-medium text-gray-600">
                                  {schedule.day}
                                </span>
                                <span className="text-gray-800">
                                  {schedule.open === schedule.close
                                    ? "Đóng cửa"
                                    : `${schedule.open} - ${schedule.close}`}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Chưa có thông tin giờ mở cửa
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <ReviewList reviews={reviews} type="restaurant" />
                </div>
              </>
            )}
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            {loader ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <ProductList products={products} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailRestaurant;
