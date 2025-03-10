// src/services/ToolsService.ts
import axios from "axios";

/*  */

// Get categories
export const getCategories = async (): Promise<{ categories: string[] }> => {
  try {
    const response = await axios.get("/api/tools/categories");
    // const response = await axios.get(
    //   "https://frp-man.com:49044/tools/categories"
    // );
    return response.data;
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "请求失败" };
  }
};

// Get tools by category
export const getTools = async (category: string): Promise<{ tools: [] }> => {
  try {
    const response = await axios.get(`/api/tools?category=${category}`);
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
    const response = await axios.post(`/api/tools/${toolId}/ratings`, {
      Authorization,
      rate,
    });
    // const response = await axios.post(`https://frp-man.com:49044/tools/${toolId}/ratings`, {
    //   Authorization: token,
    //   rate,
    // })
    return response.data;
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "请求失败" };
  }
};

// Get A tool
export const getDetail = async (toolId: number): Promise<{}> => {
  try {
    const response = await axios.get(`/api/tools/${toolId}`);
    // const response = await axios
    //   .get(`https://frp-man.com:49044/tools/${toolId}`)
    return response.data;
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "请求失败" };
  }
};
