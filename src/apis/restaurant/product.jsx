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
        "Authorization":`eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJlbWFpbCI6ImFkbWluMTJAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMyNDAwODg4LCJleHAiOjE3MzI1NzM2ODh9.sKiKtrPHIGvSRRfr1wdb-bKm86wus9kHeJMy8b5Ayj0pLZA-DMYgmvwemcpa1dSWMY-yjmM5eATy8KPIv-tLjVHeACF627smseXdR7z5Dhs6rfQw1xiOig55-UnOJkraD_l-tciGpgUP2-x0rj8W3QTndj28ioIn3jhC7BT-WXkeUxD50wf0W7DCdzyjK9wTpNaJ5SfH_6KC3ph3gh4trhoSvF-Ps74sn2BOqRDjViiE-PbulEl6czbfq6WQN-ZB4BCopoMQ_6uSGECx8I_xXjTfETJzLKZK1TpxOu4jo5oXs_gCNk0xe2LWAcwbgFd5Qfqw8RjIKfCDf3hbavm3tQ`,
        "x-client-id":"9"
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
        "x-client-id": "9",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to unpublish product", error);
    throw error;
  }
};
