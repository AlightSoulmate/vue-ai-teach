// services/adminServices.ts
import service from "./config";
import { ElMessage } from "element-plus";
import router from "@/router";

// Get users
export const GetUsers = async (Authorization: string) => {
  try {
    const response = await service.get("/auth", {
      headers: {
        Authorization,
      },
    });

    console.log("获取用户列表响应:", response.data);
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

// 1.7 管理员修改用户信息 Update users' info
export const UpdateUser = async (
  id: number,
  role: string,
  Authorization: string,
  password: string,
  nickname: string,
  username: string,
) => {
  let cno = ""; // 班级不修改，硬编入传空
  const user = {
    password,
    nickname,
    username,
    cno,
  };
  try {
    const response = await service.put(
      "/auth",
      {
        Authorization,
        user,
      },
      {
        params: {
          role,
          id,
        },
      }
    );
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

// 1.8 管理员删除用户 Delete users
export const DeleteUser = async (
  id: number,
  role: string,
  Authorization: string
) => {
  try {
    const response = await service.delete("/auth", {
      headers: {
        Authorization,
      },
      params: {
        id,
        role,
      },
    });

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

// 1.6 管理员新增用户 Add users
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

// 1.9 管理员查询用户 Query users
export const QueryUser = async (
  Authorization: string,
  username: string,
  role: string
) => {
  try {
    const response = await service.post(
      "/auth",
      {
        Authorization,
      },
      {
        params: {
          username,
          role,
        },
      }
    );
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

// 2.3 获取工具详情 Update tools' info
export const UpdateTool = async (
  Authorization: string,
  tool: object,
  toolId: number
) => {
  try {
    const response = await service.put(`/tools/${toolId}`, {
      Authorization,
      tool,
    });
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

// 2.6 删除工具（管理员） Delete tools
export const DeleteTool = async (Authorization: string, toolId: number) => {
  try {
    const response = await service.delete(`/tools/${toolId}`, {
      data: {
        Authorization,
      },
    });
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

// 2.4 添加新工具（管理员） Add tools
export const AddTool = async (
  Authorization: string,
  name: string,
  category: string,
  url: string,
  logo_url: string,
  description: string
) => {
  const tool = {
    name,
    category,
    url,
    logo_url,
    description,
  };
  try {
    const response = await service.post("/tools", {
      Authorization,
      tool,
    });
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
