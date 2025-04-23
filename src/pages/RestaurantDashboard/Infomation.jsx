import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_detailRes, change_seller_detail, messageClear } from "../../store/reducers/restaurantReducer";
import {
  get_detailRes,
  change_seller_detail,
  messageClear,
} from "../../store/reducers/restaurantReducer";
>>>>>>> fd6ec53006c2d2f6bb40b13ae456f5c596731ae7
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const Information = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { restaurant, successMessage, errorMessage, loader } = useSelector(
    (state) => state.restaurant
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const restaurantId = 1; // Replace with dynamic ID if needed
    dispatch(get_detailRes(restaurantId));
    messageClear();
  }, [dispatch]);

  useEffect(() => {
    if (restaurant) {
      setFormData(restaurant);
      setPreviewImage(restaurant.image || null);
    }
  }, [restaurant]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(messageClear());
      }, 3000);
    }
    if (errorMessage) {
      setTimeout(() => {
        dispatch(messageClear());
      }, 3000);
    }
  }, [successMessage, errorMessage, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl, // preview
        imageFile: file, // lưu file thực tế để upload
      }));
    }
  };

  // Mở dialog chọn file khi bấm nút
  const handleChooseImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Khi lưu, upload ảnh nếu có file mới (tùy backend của bạn)
  const handleSaveClick = async () => {
    let imageUrl = formData.image;
    if (formData.imageFile) {
      // TODO: Upload file formData.imageFile lên server, lấy URL trả về
      // Ví dụ:
      // imageUrl = await uploadImageAPI(formData.imageFile);
    }
    const updatedData = {
      name: formData.name,
      image: imageUrl,
      address: formData.address,
      opening_hours: formData.opening_hours,
      phone_number: formData.phone_number,
      description: formData.description,
    };

    try {
      await dispatch(change_seller_detail(updatedData)).unwrap();
      toast.success("Details updated successfully!");
      setIsEditing(false);
      messageClear();
    } catch (error) {
      toast.error(error || "Failed to update details.");
      messageClear();
    }
  };

  if (loader) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-10 mt-8 ml-0">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center md:w-1/4 w-full relative">
          {previewImage ? (
            <img
              src={previewImage}
              alt={formData.name}
              className="w-36 h-36 rounded-full border-4 border-blue-400 shadow object-cover"
            />
          ) : (
            <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gray-100 border-4 border-blue-400 text-gray-400 text-4xl font-bold shadow">
              N/A
            </div>
          )}
          {isEditing && (
            <>
              <button
                type="button"
                onClick={handleChooseImage}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                title="Change Image"
              >
                Đổi ảnh
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
          <div className="mt-4 text-xl font-bold text-blue-700">{formData.name || "Restaurant Name"}</div>
          <div className="text-base text-gray-500">{formData.status || "Active"}</div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-5 px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-lg font-semibold transition"
            >
              Edit Profile <FaRegEdit className="inline ml-2" />
            </button>
          )}
        </div>

        {/* Info Form */}
        <div className="flex-1 w-full">
          <form className="space-y-6">
            {/* Name & Phone */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Name */}
              <div className="flex-1 flex items-center">
                <label className="w-36 text-blue-700 font-semibold text-lg mr-3">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="flex-1 border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                ) : (
                  <div className="flex-1 font-bold text-xl text-gray-900">{formData.name || "N/A"}</div>
                )}
              </div>
              {/* Phone */}
              <div className="flex-1 flex items-center">
                <label className="w-36 text-blue-700 font-semibold text-lg mr-3">Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number || ""}
                    onChange={handleInputChange}
                    className="flex-1 border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                ) : (
                  <div className="flex-1 font-bold text-xl text-gray-900">{formData.phone_number || "N/A"}</div>
                )}
              </div>
            </div>

            {/* Address & Opening Hours */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Address */}
              <div className="flex-1 flex items-center">
                <label className="w-36 text-blue-700 font-semibold text-lg mr-3">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="flex-1 border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                ) : (
                  <div className="flex-1 font-bold text-xl text-gray-900">{formData.address || "N/A"}</div>
                )}
              </div>
              {/* Opening Hours */}
              <div className="flex-1 flex items-center">
                <label className="w-36 text-blue-700 font-semibold text-lg mr-3">Opening Hours</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="opening_hours"
                    value={formData.opening_hours || ""}
                    onChange={handleInputChange}
                    className="flex-1 border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                ) : (
                  <div className="flex-1 font-bold text-xl text-gray-900">{formData.opening_hours || "N/A"}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex items-center">
              <label className="w-36 text-blue-700 font-semibold text-lg mr-3">Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="flex-1 border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  rows={3}
                />
              ) : (
                <div className="flex-1 font-bold text-xl text-gray-900 whitespace-pre-line">{formData.description || "N/A"}</div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 rounded bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={loader}
                  className={`px-8 py-3 rounded font-semibold text-lg text-white transition
                    ${loader
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loader ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
          {(successMessage || errorMessage) && (
            <div className={`mt-8 text-center rounded p-4 font-semibold text-lg
              ${successMessage ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
              {successMessage || errorMessage}
            </div>
          </div>

          {/* Address */}
          <div className="border border-gray-300 rounded-md p-4">
            <label className="block text-gray-700 font-medium">Address:</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                className="w-full border border-dashed border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-800">{formData.address || "N/A"}</p>
            )}
          </div>

          {/* Status */}
          <div className="border border-gray-300 rounded-md p-4">
            <label className="block text-gray-700 font-medium">Status:</label>
            <p className="text-gray-800">{formData.status || "N/A"}</p>
          </div>

          {/* Opening Hours */}
          <div className="border border-gray-300 rounded-md p-4">
            <label className="block text-gray-700 font-medium">
              Opening Hours:
            </label>
            {isEditing ? (
              <input
                type="text"
                name="opening_hours"
                value={formData.opening_hours || ""}
                onChange={handleInputChange}
                className="w-full border border-dashed border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-800">{formData.opening_hours || "N/A"}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="border border-gray-300 rounded-md p-4">
            <label className="block text-gray-700 font-medium">
              Phone Number:
            </label>
            {isEditing ? (
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number || ""}
                onChange={handleInputChange}
                className="w-full border border-dashed border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-800">{formData.phone_number || "N/A"}</p>
            )}
          </div>

          {/* Description */}
          <div className="border border-gray-300 rounded-md p-4">
            <label className="block text-gray-700 font-medium">
              Description:
            </label>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full border border-dashed border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-800">{formData.description || "N/A"}</p>
            )}
          </div>

          {/* Action Buttons */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Edit Details
              <FaRegEdit className="inline ml-2" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className={`px-4 py-${loader ? "2 bg-gray-" : "2 bg-green-"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                disabled={loader} // Disable button while saving
                className={`px-4 py-2 ${
                  loader
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white rounded-md transition`}
              >
                {loader ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Information;
