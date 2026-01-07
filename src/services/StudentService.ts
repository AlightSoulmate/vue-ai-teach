import service from "./config";
import { ElMessage } from "element-plus";

// 获取学生收件箱（作业列表与提交记录） 对齐文档 5.2 GET /api/inbox
export const getInbox = async (Authorization: string): Promise<any> => {
  const response = await service.get("/inbox", {
    headers: { Authorization },
  });
  return response.data;
};

// 5.5 学生提交作业 POST /api/homework/{homework_id}
export const submitHomework = async (
  Authorization: string,
  homeworkId: number,
  file: File,
  onProgress?: (percent: number) => void
): Promise<any> => {
  try {
    const form = new FormData();
    form.append("file", file);
    const response = await service.post(`/homework/${homeworkId}`, form, {
      headers: { Authorization },
      onUploadProgress: (evt: any) => { // Fix TypeScript类型错误 - 使用any类型处理AxiosProgressEvent
        if (!onProgress || !evt.total) return;
        const percent = Math.min(99, Math.round((evt.loaded / evt.total) * 100));
        onProgress(percent);
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 409:
          ElMessage.error("作业已截止，无法继续提交");
          break;
        case 401:
          ElMessage.error("登录状态过期，请重新登录!");
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


