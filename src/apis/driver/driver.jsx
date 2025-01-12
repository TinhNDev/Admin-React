import axios from 'axios';
import config from '../config';
import Cookie from 'js-cookie';

// Hàm gọi API để lấy danh sách tài xế
export const getAllDrivers = async () => {
  try {
    console.log(`${config.API_URL}/admin/driver`);  // In ra URL để kiểm tra
    const response = await axios.get(`${config.API_URL}/admin/driver`, {
      headers: {
        "x-api-key": config.API_KEY,              // API Key của bạn
        "x-client-id": Cookie.get("userId"),      // Lấy userId từ Cookie
        "Authorization": Cookie.get("accessToken"), // Lấy token từ Cookie
      }
    });
    return response.data.metadata; // Trả về dữ liệu tài xế từ API
  } catch (error) {
    throw new Error('Failed to fetch drivers'); // Xử lý lỗi nếu không lấy được dữ liệu
  }
};

// Hàm gọi API để cập nhật trạng thái tài xế
export const updateDriverStatus = async (driverId, status) => {
  try {
    const response = await axios.put(`${config.API_URL}/admin/driver/${driverId}`, 
      { status },  // Dữ liệu gửi lên, cập nhật trạng thái
      {
        headers: {
          "x-api-key": config.API_KEY,              // API Key của bạn
          "x-client-id": Cookie.get("userId"),      // Lấy userId từ Cookie
          "Authorization": Cookie.get("accessToken"), // Lấy token từ Cookie
        }
      });
    return response.data; // Trả về dữ liệu tài xế sau khi cập nhật trạng thái
  } catch (error) {
    console.error('Failed to update driver status:', error);
    throw new Error('Failed to update driver status'); // Xử lý lỗi khi cập nhật trạng thái
  }
};
