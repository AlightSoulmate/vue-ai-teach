import axios from "axios";
import { getBaseUrl } from "@/utils/env";
import router from "@/router";
import { ElMessage } from "element-plus";

// 创建axios实例
const service = axios.create({
  baseURL: getBaseUrl(),
  timeout: 12000,
});

// 请求拦截器
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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // ElMessage.error("登录状态过期，请重新登录!");
          localStorage.removeItem("user");
          router.push("/form");
          break;
        case 403:
          ElMessage.error("没有权限访问");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error(`请求失败: ${error.message}`);
      }
    }
    return Promise.reject(error);
  }
);

export default service;
