// @/stores/useScoreStore.ts
// 传递评分给后端
import { ref } from "vue";
import { defineStore } from "pinia";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, type IParagraphOptions } from "docx";
import axios from "axios";
import { ElMessage } from "element-plus";

export const useScoreStore = defineStore("score", () => {
  interface Eval {
    username: string;
    tool: string;
    category: string;
    averageScore: number;
    comment: string;
  }
  const systemFile = ref<File | null>(null);
  const userFile = ref<File | null>(null);
  const uploading = ref(false);
  const systemFileName = ref("");
  const userFileName = ref("");
  const ratingDimensions = ref([
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
  const ratingEvaluation = ref<Eval>({
    username: "默认",
    tool: "默认",
    category: "默认",
    averageScore: 0,
    comment: "",
  });
  // 上传作业 - 选择文件
  const handleUserFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      userFile.value = files[0];
      userFileName.value = files[0].name;
    }
  };
  // 上传作业 - 点击上传btn
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
      // const response = await axios.post(
      //   "https://frp-man.com:49044/evaluation/upload",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      const response = await axios.post("/api/evaluation/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const message = response.data.message;
      console.log(message);
      ElMessage.success("正在评估，请稍后");

      if (message) {
        // 创建轮询函数
        const pollEvaluation = async () => {
          try {
            const Authorization = JSON.parse(
              localStorage.getItem("user") as string
            ).token;
            // const resp = await axios.post(
            //   "https://frp-man.com:49044/evaluation",
            //   {
            //     Authorization,
            //   }
            // );
            const resp = await axios.post("/api/evaluation", {
              Authorization,
            });

            // 如果获取到评估结果
            // && resp.data.status !== "processing"
            if (resp.data.message) {
              const reportText = resp.data.message;
              ElMessage.success("评估完成，正在生成报告");

              // 创建 Word 文档并下载
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
              saveAs(blob, "评测报告.docx");

              return true; // 评估完成
            }
            return false; // 继续轮询
          } catch (error) {
            console.error("轮询评估结果失败:", error);
            return false; // 出错继续轮询
          }
        };

        // 开始轮询
        const interval = setInterval(async () => {
          const isComplete = await pollEvaluation();
          if (isComplete) {
            clearInterval(interval); // 评估完成后停止轮询
          }
        }, 1500);
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

  // 评分传后端
  const evaluationTransmission = async (toolId: number) => {
    const score = calculateWeightedAverage();
    console.log(score);
    const rate = {
      rating: score,
      comment: ratingEvaluation.value.comment,
    };
    const token = JSON.parse(localStorage.getItem("user") as string).token;
    await axios
      .post(`/api/tools/${toolId}/ratings`, {
        Authorization: token,
        rate,
      })
      // .post(`https://frp-man.com:49044/tools/${toolId}/ratings`, {
      //   Authorization: token,
      //   rate,
      // })
      .then((resp) => {
        console.log("评价数据传输成功", resp.data.message);
        ToolsDetailGet(toolId);
      })
      .catch((e) => {
        console.log("评价数据传输失败", e);
      });
  };
  const toolsDetail = ref<any>({});
  const ToolsDetailGet = async (toolId: number) => {
    // await axios
    //   .get(`https://frp-man.com:49044/tools/${toolId}`)
    //   .then((resp) => {
    //     console.log(resp.data);
    //     toolsDetail.value = resp.data;
    //   })
    //   .catch((e) => {
    //     console.log("获取工具详情失败", e);
    //   });
    await axios
      .get(`/api/tools/${toolId}`)
      .then((resp) => {
        console.log(resp.data);
        toolsDetail.value = resp.data;
      })
      .catch((e) => {
        console.log("获取工具详情失败", e);
      });
  };
  // 平均分计算
  const calculateWeightedAverage = (): number => {
    const weights = [0.3, 0.25, 0.25, 0.1, 0.1];
    let weightedSum = 0;
    ratingDimensions.value.forEach((dimension, index) => {
      weightedSum += dimension.score * weights[index];
    });
    return parseFloat(weightedSum.toFixed(1));
  };

  return {
    ratingDimensions,
    ratingEvaluation,
    systemFile,
    userFile,
    uploading,
    systemFileName,
    toolsDetail,
    userFileName,
    handleUpload,
    handleUserFileChange,
    ToolsDetailGet,
    evaluationTransmission,
    calculateWeightedAverage,
  };
});
