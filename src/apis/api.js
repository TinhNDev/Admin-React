import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/v1/api",  
    headers: {
        "x-api-key": "123",  
        "Content-Type": "application/json"
    }
});

export default api;
