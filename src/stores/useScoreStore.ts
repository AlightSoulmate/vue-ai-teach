// @/stores/useScoreStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {
  uploadRate,
  getDetail,
  uploadEvaluationFile,
  getEvaluationResult,
  generateAndDownloadReport,
} from "@/services";

export const useScoreStore = defineStore("score", () => {
  interface Eval {
    username: string;
    tool: string;
    category: string;
    averageScore: number;
    comment: string;
  }
  interface ReportHistory {
    id: number;
    fileName: string;
    uploadTime: string;
    toolName: string;
    evaluationResult: string;
    downloadUrl: string;
  }

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

  // 选择文件
  const handleUserFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      userFile.value = files[0];
      userFileName.value = files[0].name;
    }
  };

  // 点击上传
  const handleUpload = async () => {
    if (!userFile.value) {
      ElMessage.warning("请选择文件");
      return;
    }

    const formData = new FormData();
    formData.append("file", userFile.value);

    const Authorization = JSON.parse(
      localStorage.getItem("user") as string
    ).token;
    formData.append("Authorization", Authorization);

    console.log(Authorization, formData.get("file"));
    uploading.value = true;

    try {
      // 使用服务函数上传文件
      const response = await uploadEvaluationFile(formData);
      const message = response.message;
      console.log(message);
      ElMessage.success("正在评估，请稍后");

      if (message) {
        // 轮询函数
        const pollEvaluation = async () => {
          try {
            const Authorization = JSON.parse(
              localStorage.getItem("user") as string
            ).token;

            // 使用服务函数获取评价结果
            const resp = await getEvaluationResult(Authorization);

            // 获取到评估结果
            const status = resp.status;
            console.log("状态码为", status);
            if (status === 200) {
              const originalText = resp.message;
              const reportText = JSON.parse(
                '"' + originalText.replace(/\\\\/g, "\\") + '"'
              ); // 将unicode转为中文
              console.log(reportText);
              ElMessage.success("评估完成，正在生成报告");

              // 使用服务函数生成并下载报告
              const user = JSON.parse(localStorage.getItem("user") as string);
              await generateAndDownloadReport(reportText, user.username);

              console.log("评估完成");
              return true;
            } else if (status === 204) {
              console.log("继续轮询");
              return false;
            }
            console.log("继续轮询");
            return false;
          } catch (e) {
            console.error("轮询评估结果失败", e);
            console.log("出错继续轮询");
            return false;
          }
        };

        // 轮询
        const interval = setInterval(async () => {
          const isComplete = await pollEvaluation();
          if (isComplete) {
            console.log("停止轮询");
            clearInterval(interval);
          }
        }, 2000);
      } else {
        ElMessage.error(message || "上传失败");
      }
    } catch (error) {
      ElMessage.error("上传失败");
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
      const resp = await uploadRate(token, rateValue, toolId);
      console.log(resp.message);
      // 立即获取更新后的数据
      await ToolsDetailGet(toolId);
    } catch (e: any) {
      console.error("评价失败", e);
    }
  };

  const ToolsDetailGet = async (toolId: number) => {
    try {
      // 强制重置状态
      toolsDetail.value = {};

      // 获取新数据
      const response = await getDetail(toolId);
      console.log("获取到的工具详情:", response);

      // 直接更新状态
      toolsDetail.value = response;
      return response;
    } catch (e: any) {
      console.error("获取工具详情失败", e);
      throw e.response ? e.response.data : { message: "请求失败" };
    }
  };

  // 平均分计算
  const calculateWeightedAverage = (): number => {
    const weights = [0.3, 0.25, 0.25, 0.1, 0.1];
    let weightedSum = 0;
    rateStandards.value.forEach((standard, index) => {
      weightedSum += standard.score * weights[index];
    });
    return parseFloat(weightedSum.toFixed(1));
  };

  return {
    rateStandards,
    rate,
    userFile,
    uploading,
    toolsDetail,
    userFileName,
    reportHistory,
    loadingHistory,
    handleUpload,
    handleUserFileChange,
    ToolsDetailGet,
    evaluationTransmission,
    calculateWeightedAverage,
  };
});
