import axios from "axios";

const api = axios.create({
  // baseURL: "https://sbr09801-8080.asse.devtunnels.ms/v1/api",
  baseURL: "https://vpvt75qh-8080.asse.devtunnels.ms/v1/api",
  headers: {
    "x-api-key": "123",
    "Content-Type": "application/json",
  },
});

export default api;
