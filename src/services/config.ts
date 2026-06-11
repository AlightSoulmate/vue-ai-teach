import axios from "axios";
import { getBaseUrl } from "@/utils/env";
import router from "@/router";
import { ElMessage } from "element-plus";

const RETRY_LIMIT = 2;
const RETRY_DELAY = 500;

function getStoredToken(): string {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.token || "";
  } catch {
    return "";
  }
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// 创建axios实例
const service = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = token;
    }
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
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const canRetry = !status || status === 408 || status === 429 || status >= 500;

    if (config && canRetry) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < RETRY_LIMIT) {
        config.__retryCount += 1;
        await delay(RETRY_DELAY * config.__retryCount);
        return service(config);
      }
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error("登录状态过期，请重新登录!");
          localStorage.removeItem("user");
          router.push("/login");
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
