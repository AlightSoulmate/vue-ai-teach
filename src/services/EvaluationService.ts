import service from "./config";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, type IParagraphOptions } from "docx";

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
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "上传失败" };
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
  } catch (e: any) {
    throw e.response ? e.response.data : { message: "获取评价结果失败" };
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
    throw new Error("生成报告失败");
  }
};