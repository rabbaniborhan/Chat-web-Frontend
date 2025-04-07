import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import { axiosInstance } from "./../lib/axios.js";

const BASE_URL = "https://chat-app-backend-9l9x.onrender.com/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSignUp: false,
  isLogging: false,
  isUpdatingProfile: false,
  onlineUser: [],
  socket: null,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res?.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log(
        "Auth check failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("jwt", token);
      }
      set({ authUser: res.data?.user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      console.log(error.response?.data);
    } finally {
      set({ isSignUp: false });
    }
  },

  login: async (data) => {
    set({ isLogging: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("jwt", token);
      }
      set({ authUser: res?.data?.user });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLogging: false });
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("jwt");
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      if (res.status === 200) {
        set({ authUser: res.data });
        toast.success("Profile Updated Successfully");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Profile update error:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser?._id,
      },
    });

    newSocket.on("connect", () => {
      console.log(" Socket connected!");
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUser: userIds });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null });
  },
}));
