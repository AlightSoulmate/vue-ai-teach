// src/services/AuthService.ts
import axios from "axios";
import { ElMessage } from "element-plus";
import type { AuthResponse, AuthLoginResponse } from "@/interfaces";

/* Authentication & User Actions 
  - Registration 
  - Login
  - User update info
*/

// Request Intercept
axios.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.url);
    console.log("Request data:", config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register
export const register = async (
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  try {
    if (role !== "admin") {
      // const response = await axios.post(
      //   "https://frp-man.com:49044/user/register",
      //   {
      //     username,
      //     password,
      //     role,
      //   }
      // );
      const response = await axios.post("/api/user/register", {
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
    console.log(error);
    throw error.response ? error.response.data : { message: "请求失败" };
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
      const response = await axios.post("/api/auth/login", {
        username,
        password,
        role,
      });
      // const response = await axios.post(
      //   "https://frp-man.com:49044/auth/login",
      //   {
      //     username,
      //     password,
      //     role,
      //   }
      // );
      console.log(response.data);
      return response.data;
    } else {
      const response = await axios.post("/api/user/login", {
        username,
        password,
        role,
      });
      // const response = await axios.post(
      //   "https://frp-man.com:49044/user/login",
      //   {
      //     username,
      //     password,
      //     role,
      //   }
      // );
      return response.data;
    }
  } catch (error: any) {
    console.log(error);
    throw error.response ? error.response.data : { message: "请求失败" };
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
    // const response = await axios.put("https://frp-man.com:49044/user", {
    //   Authorization,
    //   old_password,
    //   password,
    //   nickname,
    //   username,
    // });
    const response = await axios.put("/api/user", {
      Authorization,
      old_password,
      password,
      nickname,
      username,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};
