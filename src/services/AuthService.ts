// src/services/AuthService.ts
import axios from "axios";
import type { AxiosResponse } from "axios";

interface User {
  id: number;
  nickname: any;
  username: any;
  role: string;
  message: string;
}

interface AuthResponse {
  Authorization: string;
  user: User;
}

// request intercept
axios.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.url);
    console.log("Request data:", config.data || "no request body or error");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// register
export const register = async (
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  try {
    if (role !== "管理员") {
      role = role === "学生" ? "student" : "teacher";
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
      console.log(response.data);
      return response.data;
    } else {
      throw new Error("管理员不允许注册");
    }
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// login
export const login = async (
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> => {
  try {
    if (role === "管理员") {
      role = "admin";
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
      role = role === "学生" ? "student" : "teacher";
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
      console.log(response.data);
      return response.data;
    }
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// User modification self information
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
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};
