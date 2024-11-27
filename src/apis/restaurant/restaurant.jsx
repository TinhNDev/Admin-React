import axios from 'axios';
import config from '../config'
import Cookie from 'js-cookie';

// Hàm gọi API để lấy danh sách sản phẩm
export const getAllRestaurants = async () => {
    try {
      console.log(`${config.API_URL}/products`)
      const response = await axios.get(`${config.API_URL}/admin/restaurant`,{
          headers:{
              "x-api-key":config.API_KEY,
              "x-client-id":Cookie.get("userId"),
              "Authorization":Cookie.get("accessToken"),
          }
      });
      return response.data.metadata;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  };
  export const updateRestaurantStatus = async (restaurantId) => {
    try {
        const response = await axios.put(
            `${config.API_URL}/admin/restaurant/${restaurantId}`,
            {}, // Nếu cần body, có thể thêm tại đây
            {
                headers: {
                    "x-api-key": config.API_KEY,
                    "x-client-id": Cookie.get("userId"),
                    "Authorization": Cookie.get("accessToken"),
                }
            }
        );
        return response.data.metadata; // Trả về trạng thái mới của nhà hàng
    } catch (error) {
        throw new Error('Failed to update restaurant status');
    }
};