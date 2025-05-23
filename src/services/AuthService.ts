// src/services/AuthService.ts
import { ElMessage } from "element-plus";
import type { AuthResponse, AuthLoginResponse } from "@/interfaces";
import service from "./config";
import router from "@/router";

/* 
  Authentication & User Actions 
  - Registration 
  - Login
  - User update info
*/

// Register
export const register = async (
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  try {
    if (role !== "admin") {
      const response = await service.post("/user/register", {
        username,
        password,
        role,
      });
      return response.data;
    } else {
      ElMessage({
        message: "管理员不允许注册！",
        type: "warning",
      });
      throw new Error("管理员不允许注册");
    }
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error("登录状态过期，请重新登录!");
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  }
};

// Login
export const login = async (
  username: string,
  password: string,
  role: string
): Promise<AuthLoginResponse> => {
  try {
    if (role === "admin") {
      const response = await service.post("/auth/login", {
        username,
        password,
        role,
      });
      console.log(response.data);
      return response.data;
    } else {
      const response = await service.post("/user/login", {
        username,
        password,
        role,
      });
      console.log(response.status);
      return response.data;
    }
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error("登录状态过期，请重新登录!");
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  }
};

// User update info
export const change = async (
  Authorization: string,
  nickname: string,
  old_password: string,
  password: string,
  username: string
): Promise<AuthResponse> => {
  try {
    const response = await service.put("/user", {
      Authorization,
      old_password,
      password,
      nickname,
      username,
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error("登录状态过期，请重新登录!");
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  }
};
