import axios from "axios";
import Cookie from 'js-cookie';
import config from '../config'

// Hàm sign up
export const signUp = async (email, password, role) => {
  try {
    const response = await axios.post(
      `${config.API_URL}/user/signup`,
      { email, password, role },
      {
        headers: {
          "x-api-key": config.API_KEY,
          "Content-Type ": "application/json"
        }
      }
    );
    if (response.data.tokens && response.data.tokens.accessToken) {
      Cookie.set("accessToken", response.data.tokens.accessToken, { expires: 7 });
    }
    return response.data;
  } catch (error) {
    console.error("Error during sign up:", error.response?.data || error.message);
    throw error;
  }
};

// Hàm sign in
export const signIn = async (email, password) => {
  try {
    console.log(config.API_URL)
    const response = await axios.post(
      `${config.API_URL}/user/login`,
      { email, password },
      {
        headers: {
          "x-api-key": config.API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    if (response.data.metadata.tokens && response.data.metadata.tokens.accessToken) {
      Cookie.set("accessToken", response.data.metadata.tokens.accessToken, { expires: 3 });
      Cookie.set("refreshToken", response.data.metadata.tokens.refreshToken, { expires: 7 });
      Cookie.set("username", response.data.metadata.user.email)
      Cookie.set("userId", response.data.metadata.user.id)
    }
    return response.data;
  } catch (error) {
    console.error("Error during sign in:", error.response?.data || error.message);
    throw error;
  }
};
