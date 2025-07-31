

import { toast } from "react-toastify";
import axios from "axios";

export const axiosInstance = axios.create({

});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Interceptors working and i got the token");
    const token = localStorage.getItem("token");
    if (token) {
      config.headers[`Authorization`] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
    return response;
  },

  (error) => {
    console.error(`api call failed:`, error);

    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (error.response?.status === 401) {
      console.log("Unauthorized - Redirecting to login");
      window.location.href = "/login";

    } else {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    return Promise.reject(error);
  }
);
