// services/adminServices.ts
import service from "./config";

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
    console.error("获取用户列表错误:", error);
    console.error("错误详情:", error.response?.data || error.message);
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
    console.error("更新用户信息错误:", error);
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
    console.error("删除用户错误:", error);
    console.log(error.response?.data);
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
    console.error("添加用户错误:", error);
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
    console.error("查询用户错误:", error);
    throw error.response ? error.response.data : { message: "请求失败" };
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
    console.error("更新工具信息错误:", error);
    throw error.response ? error.response.data : { message: "请求失败" };
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
    console.error("删除工具错误:", error);
    throw error.response ? error.response.data : { message: "请求失败" };
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
    console.error("添加工具错误:", error);
    throw error.response ? error.response.data : { message: "请求失败" };
  }
};
