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

// 1.1 Register
export const register = async (
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  try {
    let cno = 0; // 约定0代表班级未归属
    if (role === "student" || role === "teacher") {
      const response = await service.post("/user/register", {
        username,
        password,
        role,
        cno
      });
      return response.data;
    } else {
      ElMessage.warning("只有学生可以注册！");
      throw new Error("只有学生可以注册");
    }
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          ElMessage.error("请求参数不合法");
          break;
        case 401:
          ElMessage.error("身份失效，请刷新重试");
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
};

// 1.2/1.3 LOGIN
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
      return response.data;
    } else {
      const response = await service.post("/user/login", {
        username,
        password,
        role,
      });
      console.log("登录响应:", response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (error.response.data?.message === "user not found") {
            ElMessage.error("用户不存在，请先注册");
          } else {
            ElMessage.error("用户名或密码错误，请重试!");
          }
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
};

// 1.4 用户修改个人信息 User update info
export const change = async (
  Authorization: string,
  nickname: string,
  old_password: string,
  password: string,
  username: string,
): Promise<AuthResponse> => {
  try {
    let cno = "";// 班级不修改，硬编入传空
    const response = await service.put("/user", {
      Authorization,
      old_password,
      password,
      nickname,
      username,
      cno
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
    }
    return Promise.reject(error);
  }
};

// 4.1 获得所有班级
export const getAllClasses = async (): Promise<any> => {
  try {
    const response = await service.get("/class");
    console.log("班级列表响应:", response.data.classes);
    return response.data.classes;
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error("身份失效，请刷新重试");
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
}