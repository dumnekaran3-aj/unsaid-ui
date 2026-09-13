import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Replace with your Render backend URL once deployed
// For local testing on your phone (same wifi), use your laptop's local IP:
// e.g. "http://192.168.1.5:5000/api"
export const BASE_URL = "http://192.168.1.32:5000/api";
export const SOCKET_URL = "http://192.168.1.32:5000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token automatically to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("unsaid_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
