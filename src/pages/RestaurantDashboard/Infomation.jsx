import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_detailRes, change_seller_detail } from "../../store/reducers/restaurantReducer";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const Information = () => {
  const dispatch = useDispatch();

  const { restaurant, successMessage, errorMessage, loader } = useSelector(
    (state) => state.restaurant
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const restaurantId = 1; // Replace with dynamic ID if needed
    dispatch(get_detailRes(restaurantId));
  }, [dispatch]);

  useEffect(() => {
    if (restaurant) {
      setFormData(restaurant);
    }
  }, [restaurant]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    const updatedData = {
      name: formData.name,
      image: formData.image,
      address: formData.address,
      opening_hours: formData.opening_hours,
      phone_number: formData.phone_number,
      description: formData.description,
    };

    try {
      await dispatch(change_seller_detail(updatedData)).unwrap();
      toast.success("Details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update details.");
    }
  };

  if (loader) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-center mb-4">
          {formData?.image ? (
            <img
              src={formData.image}
              alt={formData.name}
              className="w-48 h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="h-48 w-48 flex justify-center items-center border border-dashed">
              No Image Available
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="border border-gray-300 rounded-md p-4">
            <label className="block text-gray-700 font-medium">Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full border border-dashed border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-800">{formData.name || "N/A"}</p>
            )}
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
            <label className="block text-gray-700 font-medium">Opening Hours:</label>
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
            <label className="block text-gray-700 font-medium">Phone Number:</label>
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
            <label className="block text-gray-700 font-medium">Description:</label>
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

