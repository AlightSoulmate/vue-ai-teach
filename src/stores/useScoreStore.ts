// @/stores/useScoreStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {
  uploadRate,
  getDetail,
  uploadEvaluationFileByFileId,
  getEvaluationResult,
  generateAndDownloadReport,
} from "@/services";
import type { Eval, ReportHistory } from "@/interfaces";
export const useScoreStore = defineStore("score", () => {
  const userFile = ref<File | null>(null);
  const uploading = ref(false);
  const userFileName = ref("");
  const reportHistory = ref<ReportHistory[]>([]);
  const loadingHistory = ref(false);
  const rateStandards = ref([
    {
      name: "内容质量",
      percent: 0.3,
      score: 0,
      criteria: [
        "表达清晰：生成内容易懂、逻辑清晰",
        "创意能力：提供创新性的答案或富有变化的内容",
        "上下文理解：能否根据历史输入调整生成结果，提高连贯性",
        "事实准确性：是否提供错误或误导性内容",
      ],
      basis: "",
    },
    {
      name: "性能高效性",
      percent: 0.25,
      score: 0,
      criteria: [
        "结果精准：生成的结果符合或超出预期",
        "响应速度：用户指令下达后能快速生成结果",
        "运行稳定：不卡顿、不崩溃",
        "核心功能完备：具备同类产品核心功能",
      ],
      basis: "",
    },
    {
      name: "操作便捷性",
      percent: 0.25,
      score: 0,
      criteria: [
        "界面交互：美观简洁，功能易查找",
        "新手引导：提供教程或文档，帮助快速熟悉",
        "多端兼容：支持电脑、手机、平板同步使用",
        "个性化设置：可根据用户偏好调整 AI 行为",
      ],
      basis: "",
    },
    {
      name: "付费合理性",
      percent: 0.1,
      score: 0,
      criteria: [
        "免费使用：提供免费版本，主要功能可试用",
        "定价合理：价格在可接受范围",
        "价格匹配：付费功能质量与价格相符",
        "价格灵活：提供多种套餐或功能模块收费",
      ],
      basis: "",
    },
    {
      name: "服务反馈水平",
      percent: 0.1,
      score: 0,
      criteria: [
        "用户反馈：提供反馈通道，客服响应及时",
        "隐私保护：清晰告知数据收集情况",
        "产品活跃性：定期更新，优化性能，采纳用户反馈",
        "用户社区活跃度：有社区供提问、交流、分享",
      ],
      basis: "",
    },
  ]);
  const rate = ref<Eval>({
    username: "默认",
    tool: "默认",
    category: "默认",
    averageScore: 0,
    comment: "",
  });
  const lastUploadRecord = ref<{
    timestamp: number;
    fileName: string;
  } | null>(null);

  // 节流检查函数
  const checkThrottle = (fileName: string): boolean => {
    if (!lastUploadRecord.value) {
      return true;
    }

    const now = Date.now();
    const STOP_TIME = 10 * 1000; // 10秒

    if (
      lastUploadRecord.value.fileName === fileName &&
      now - lastUploadRecord.value.timestamp < STOP_TIME
    ) {
      const remainingSeconds = Math.ceil(
        (STOP_TIME - (now - lastUploadRecord.value.timestamp)) / 1000
      );
      ElMessage.warning(
        `请求过于频繁，请等待 ${remainingSeconds} 秒后再次上传`
      );
      return false;
    }

    return true;
  };

  // 选择文件
  const handleUserFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      userFile.value = files[0];
      userFileName.value = files[0].name;
    }
  };

  const progress = ref(0); // 进度状态
  // 文件读取与分片
  const CHUNK_SIZE = 1 * 1024 * 1024; // 每片 1MB
  function splitFile(file: File): Blob[] {
    const chunks: Blob[] = [];
    let start = 0;
    while (start < file.size) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      chunks.push(file.slice(start, end));
      start = end;
    }
    return chunks;
  }

  // 点击上传
  const handleUpload = async () => {
    if (!userFile.value) {
      ElMessage.warning("请选择文件");
      return;
    }

    //节流检查
    if (!checkThrottle(userFile.value.name)) {
      return;
    }

    const Authorization = JSON.parse(
      localStorage.getItem("user") as string
    ).token;
    uploading.value = true;

    try {
      lastUploadRecord.value = {
        timestamp: Date.now(),
        fileName: userFile.value.name,
      };

      let response = null;
      let lastMessage = null;
      const chunks = splitFile(userFile.value);
      const fileSum = chunks.length;
      for (let i = 0; i < chunks.length; i++) {
        const formData = new FormData();
        formData.append("Authorization", Authorization);
        formData.append("file", chunks[i]);
        formData.append("fileSum", String(fileSum));
        response = await uploadEvaluationFileByFileId(formData, i + 1);
        progress.value = Math.round(((i + 1) / fileSum) * 100);
      }

      if (lastMessage) {
        // 轮询函数
        const pollEvaluation = async () => {
          try {
            const resp = await getEvaluationResult(Authorization);

            if (resp.status === 200) {
              uploading.value = false;
              progress.value = 0;
              const originalText = resp.message;
              const reportText = JSON.parse(
                '"' + originalText.replace(/\\\\/g, "\\") + '"'
              );
              console.log(reportText);

              const user = JSON.parse(localStorage.getItem("user") as string);

              await generateAndDownloadReport(reportText, user.username);

              return true;
            } else {
              progress.value = 100;
              ElMessage.info("正在轮询");
              return false;
            }
          } catch (e) {
            ElMessage.warning("未知错误,继续轮询");
            return false;
          }
        };

        // 轮询 每2.5秒
        const interval = setInterval(async () => {
          const isComplete = await pollEvaluation();
          if (isComplete) {
            ElMessage.success("评估完成");
            clearInterval(interval);
          }
        }, 2500);
      } else {
        ElMessage.error(lastMessage as any);
      }
    } catch (error) {
      console.error(error);
    } finally {
      uploading.value = false;
    }
  };

  const toolsDetail = ref<any>({});

  // 评分传后端
  const evaluationTransmission = async (toolId: number) => {
    const score = calculateWeightedAverage();
    console.log(score);
    const rateValue = {
      rating: score,
      comment: rate.value.comment,
    };
    const token = JSON.parse(localStorage.getItem("user") as string).token;
    try {
      await uploadRate(token, rateValue, toolId);
      ElMessage.success("评分上传成功");
      await ToolsDetailGet(toolId);
    } catch (error: any) {
      ElMessage.error("评分上传失败");
    }
  };

  const ToolsDetailGet = async (toolId: number) => {
    try {
      toolsDetail.value = {};
      const response = await getDetail(toolId);
      toolsDetail.value = response;
      return response;
    } catch (e: any) {
      ElMessage.error("工具详情获取失败");
    }
  };

  // 平均分计算
  const calculateWeightedAverage = (): number => {
    const WEIGHTS = [0.3, 0.25, 0.25, 0.1, 0.1];
    let weightedSum = 0;
    rateStandards.value.forEach((standard, index) => {
      weightedSum += standard.score * WEIGHTS[index];
    });
    return parseFloat(weightedSum.toFixed(1));
  };

  return {
    rateStandards,
    rate,
    progress,
    userFile,
    uploading,
    toolsDetail,
    userFileName,
    reportHistory,
    loadingHistory,
    lastUploadRecord,
    checkThrottle,
    handleUpload,
    handleUserFileChange,
    ToolsDetailGet,
    evaluationTransmission,
    calculateWeightedAverage,
  };
});
