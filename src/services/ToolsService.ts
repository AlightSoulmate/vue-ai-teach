// src/services/ToolsService.ts
import service from "./config";

/*  */

// Get categories
export const getCategories = async (): Promise<{ categories: string[] }> => {
  try {
    const response = await service.get("/tools/categories");
    return response.data;
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "请求失败" };
  }
};

// Get tools by category
export const getTools = async (category: string): Promise<{ tools: [] }> => {
  try {
    const response = await service.get(`/tools`, {
      params: { category },
    });
    return response.data;
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "请求失败" };
  }
};

// Upload A tool's rate/comment
export const uploadRate = async (
  Authorization: string,
  rate: any,
  toolId: number
): Promise<{ message: string }> => {
  try {
    const response = await service.post(`/tools/${toolId}/ratings`, {
      Authorization,
      rate,
    });
    return response.data;
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "请求失败" };
  }
};

// Get A tool
export const getDetail = async (toolId: number): Promise<{}> => {
  try {
    const response = await service.get(`/tools/${toolId}`);
    return response.data;
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "请求失败" };
  }
};
