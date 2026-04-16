import axios from "axios";
import { getToken } from "./tokenService";

const API = axios.create({
  baseURL: "http://10.107.125.40:3000/api", 
  withCredentials: true,
});

API.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;