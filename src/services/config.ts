import axios from "axios";
import { getBaseUrl, isMockEnabled, getMockApi } from "@/utils/env";

// 创建axios实例
const service = axios.create({
  baseURL: isMockEnabled() ? getMockApi() : getBaseUrl(),
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.url);
    console.log("Request data:", config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
