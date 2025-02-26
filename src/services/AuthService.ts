// src/services/AuthService.ts
import axios from "axios";
import type { AxiosResponse } from "axios";

interface User {
  id: number;
  username: string;
  role: string;
  message: string;
}

interface AuthResponse {
  Authorization: string;
  user: User;
}

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.url); // 打印请求的 URL
    console.log("Request data:", config.data); // 打印请求的请求体数据
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 注册
export const registerUser = async (
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  try {
    if (role !== "管理员") {
      // const response = await axios.post(
      //   "https://frp-man.com:49044/user/register",
      //   {
      //     username,
      //     password,
      //     // role,
      //   }
      // );
      const response = await axios.post("/api/user/register", {
        username,
        password,
        role,
      });
      console.log(response.data);
      return response.data;
    } else {
      throw new Error("管理员不能注册");
    }
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// 登录
export const loginUser = async (
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  try {
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
    //     // role,
    //   }
    // );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};
