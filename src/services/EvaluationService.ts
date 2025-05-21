import service from "./config";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, type IParagraphOptions } from "docx";
import { ElMessage } from "element-plus";
import router from "@/router";

// 定义历史评价记录的数据类型
export interface HistoryRecord{
  user: string; // 用户昵称
  rating: number; // 用户评分
  comment: string; // 具体内容
  rate_time: string; // 评分时间
  tool_id: string; // 工具ID
}

// 获得个人历史评价记录函数的响应体类型
export interface PersonalHistoryRecordsResponse {
  rates: HistoryRecord[];
}

// 教师端获得该课程班级学生的所有历史评价记录的接口定义 (根据 3.12 接口响应体)
export interface ClassHistoryRecord {
  username: string; // 学号
  user: string; // 用户昵称
  rating: number; // 用户评分
  comment: string; // 具体内容
  cno: string; // 班级号
  rate_time: string; // 评分时间
  tool_id: string; // 工具ID
}

// 教师端获得该课程班级学生的所有历史评价记录函数的响应体类型
export interface ClassHistoryRecordsResponse {
    message: string;
    rates: ClassHistoryRecord[];
}


// 上传评价文件
export const uploadEvaluationFile = async (
  formData: FormData
): Promise<{ message: string }> => { 
  try {
    const response = await service.post("/evaluation/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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




// 分片上传
export const uploadEvaluationFileByFileId = async (
  formData: FormData,
  fileId: number
): Promise<{ message: string }> => {
  try {
    const response = await service.post(
      `/evaluation/upload/${fileId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
// 获取评价结果
export const getEvaluationResult = async (
  Authorization: string
): Promise<{ message: string; status: number }> => {
  try {
    const response = await service.post("/evaluation", {
      Authorization,
    });
    return {
      message: response.data.message,
      status: response.status,
    };
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

// 生成并下载评价报告
export const generateAndDownloadReport = async (
  reportText: string,
  username: string
): Promise<void> => {
  try {
    // 创建Word文档并下载
    const paragraphs = reportText
      .split("\n")
      .map((line: string | IParagraphOptions) => new Paragraph(line));

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${username}的评测报告.docx`);
  } catch (e: any) {
    ElMessage.error("报告生成失败");
    throw new Error("生成报告失败");
  }
};

//获取历史评价记录函数
//获得该课程班级学生的所有历史评价记录（教师端）
export const getClassHistoryRecords = async (
  courseId: string | number // 根据接口文档 /api/class/ratings/{courseId}
): Promise<ClassHistoryRecordsResponse> => {
  try {
    // 根据接口文档，Authorization 放在请求体，但GET请求体不常见。
    // 假定 Authorization 会通过 service 拦截器自动添加。
    const response = await service.get(`/api/class/ratings/${courseId}`);
    return response.data; // 响应体直接是 { message: "查询成功", rates: [...] }
  } catch (error: any) {
    if (error.response) {
    switch (error.response.status) {
      case 401:
        ElMessage.error("登录状态过期，请重新登录!");
        localStorage.removeItem("user");
        router.push("/form"); // 假设登录页面是 /form
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



/**
 * 获取学生的所有历史评价记录
 * @returns Promise<HistoryRecordResponse> 包含历史记录数组的 Promise
 */
export const getHistoryRecords = async (): Promise<PersonalHistoryRecordsResponse> => {
  try {
    // 根据接口文档，Authorization 放在请求体，但GET请求体不常见。
    // 假定 Authorization 会通过 service 拦截器自动添加。
    const response = await service.get("/api/ratings");
    return response.data; // 响应体直接是 { rates: [...] }
  }catch (error: any) {
    // 复用现有的错误处理逻辑
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
           // 404 可能意味着接口不存在，或者（如果接口设计如此）该用户没有历史记录。
           // 通常获取列表接口即使没有数据也返回200和空列表，但如果后端返回404且表示没有数据，可以特殊处理
           // 例如：ElMessage.info("当前没有历史评价记录"); return { data: [] };
           // 这里沿用通用的错误处理
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
    // 将错误继续抛出，以便调用方可以选择捕获
    return Promise.reject(error);
  }
}











