import axios from 'axios';
import config from '../config'
import Cookie from 'js-cookie';
// Hàm gọi API để lấy danh sách sản phẩm
export const getAllProducts = async () => {
  try {
    console.log(`${config.API_URL}/products`)
    const response = await axios.get(`${config.API_URL}/products?limit=30&page=1`,{
        headers:{
            "x-api-key":config.API_KEY
        }
    });
    return response.data.metadata;  // Trả về dữ liệu sản phẩm
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

export const updateProduct = async (product_id, categoriesId, toppingData, payload) => {
  try {
    const response = await axios.put(`${config.API_URL}/products/${product_id}`, {
      categoriesId,
      toppingData,
      productData: payload.productData,
    },{
      headers:{
        "x-api-key":config.API_KEY,
        "Authorization":Cookie.get("accessToken"),
        "x-client-id":"9"
    }
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const publishProduct = async(product_id) =>{
  try {
    const response = await axios.post(`${config.API_URL}/products/public/${product_id}`,{},{
      headers:{
        "x-api-key":config.API_KEY,
        "Authorization":Cookie.get("accessToken"),
        "x-client-id":Cookie.get("userId")
      }
    });
    return response.data
  } catch (error) {
    console.error('Failed to publish product', error);
    throw error;
  }
}

export const unpublishProduct = async (product_id) => {
  try {
    const response = await axios.post(`${config.API_URL}/products/unpublic/${product_id}`,{}, {
      headers: {
        "x-api-key": config.API_KEY,
        "Authorization": Cookie.get("accessToken"),
        "x-client-id": Cookie.get("userId"),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to unpublish product", error);
    throw error;
  }
};
