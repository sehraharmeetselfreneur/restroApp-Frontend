import axios from "axios";

const axiosInstance = axios.create({
    baseUrl: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            console.log("Unauthorized, please login again");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;