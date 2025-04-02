import axios from "axios";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://chat-app-backend-chi-teal.vercel.app/api";
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
