import axios from "axios";

const baseURL = "https://chat-app-backend-9l9x.onrender.com/api";
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
