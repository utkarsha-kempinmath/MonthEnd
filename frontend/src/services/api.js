import axios from "axios";
import { getToken } from "./tokenService";

const API = axios.create({
    baseURL: 'http://192.168.2.125:3000/api'
});

API.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;