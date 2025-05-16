// services/adminServices.ts
import service from "./config";
import { ElMessage } from "element-plus";
import router from "@/router";

// Get users
export const GetUsers = async (Authorization: string) => {
  try {
    console.log("发送GetUsers请求");
    console.log(Authorization);
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
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
  const user = {
    nickname,
    username,
    password,
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

// Delete users
export const DeleteUser = async (
  id: number,
  role: string,
  Authorization: string
) => {
  try {
    console.log(Authorization);
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
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

// Query users
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  }
};

// Update tools' info
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  }
};

// Delete tools
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  }
};

// Add tools
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
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请检查网络连接");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  }
};
