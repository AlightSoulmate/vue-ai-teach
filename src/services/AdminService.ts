// services/adminServices.ts
import axios from "axios";
import service from "./config";

// 出现/api混乱 2025.3.14

/* Admin Operations 
  - User Management
  - Tool Management
*/

// Get users
export const GetUsers = async (Authorization: string) => {
  try {
    const response = await axios.get("/auth", {
      data: Authorization,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Update users' info
export const UpdateUser = async (
  id: number,
  role: string,
  Authorization: string,
  password: string,
  nickname: string,
  username: string
) => {
  try {
    const response = await service.put(
      "/auth",
      {
        Authorization,
        password,
        nickname,
        username,
      },
      {
        params: {
          id,
          role,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Delete users
export const DeleteUser = async (
  id: number,
  role: string,
  Authorization: string
) => {
  try {
    const response = await service.delete("/auth", {
      data: {
        Authorization,
      },
      params: {
        id,
        role,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Add users
export const AddUser = async (
  Authorization: string,
  nickname: string,
  username: string,
  password: string,
  role: string
) => {
  const user = {
    nickname,
    username,
    password,
  };
  try {
    const response = await service.post(
      "/auth",
      {
        Authorization,
        user,
      },
      {
        params: {
          role,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};

// Query users
export const QueryUser = async (
  Authorization: string,
  username: string,
  role: string
) => {
  try {
    const response = await service.get("/auth", {
      data: {
        Authorization,
      },
      params: {
        username,
        role,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};
