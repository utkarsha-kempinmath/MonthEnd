import axios from "axios";
import { getToken } from "./tokenService";

const API = axios.create({
    baseURL: 'https://monthend.onrender.com/api',
    timeout: 30000
});

API.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;