import axios from "axios";
import { getBaseUrl } from "@/utils/env";

// 创建axios实例
const service = axios.create({
  baseURL: getBaseUrl(),
  timeout: 8000,
});

// 请拦截器
service.interceptors.request.use(
  (config) => {
    console.log("🔍 Base URL:", getBaseUrl());
    console.log("🔍 Request URL:", config.url);
    console.log("🔍 Request data:", config.data);
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
    if (error.code === "ERR_CERT_AUTHORITY_INVALID") {
      console.warn("SSL证书验证失败，请确认您使用的是可信任的HTTPS连接");
    }
    return Promise.reject(error);
  }
);

export default service;
