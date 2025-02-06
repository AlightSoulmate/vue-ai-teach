// @/stores/useScoreStore.ts
// 传递评分给后端、模型端
import { ref } from "vue";
import { defineStore } from "pinia";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, type IParagraphOptions } from "docx";
import axios from "axios";
export const useScoreStore = defineStore("score", () => {
  interface Eval {
    username: string;
    tool: string;
    category: string;
    content_quality: string;
    efficiency: string;
    Convenience: string;
    payment: string;
    feedback_level: string;
    averageScore: number;
    comment: string;
  }
  const ratingDimensions = ref([
    {
      name: "内容质量 (30%)",
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
      name: "性能高效性 (25%)",
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
      name: "操作便捷性 (25%)",
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
      name: "付费合理性 (10%)",
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
      name: "服务反馈水平 (10%)",
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
    username: "于传宇",
    tool: "默认",
    category: "默认",
    content_quality: "默认",
    efficiency: "默认",
    Convenience: "默认",
    payment: "默认",
    feedback_level: "默认",
    averageScore: 0,
    comment: "默认",
  });
  const evaluationAssign = () => {
    const tool = JSON.parse(localStorage.getItem("selectedTool") || "{}");
    // console.log(tool);

    ratingEvaluation.value.tool = tool.name;
    ratingEvaluation.value.category = tool.category;
    ratingEvaluation.value.content_quality = ratingDimensions.value[0].name;
    ratingEvaluation.value.efficiency = ratingDimensions.value[1].name;
    ratingEvaluation.value.Convenience = ratingDimensions.value[2].name;
    ratingEvaluation.value.payment = ratingDimensions.value[3].name;
    ratingEvaluation.value.feedback_level = ratingDimensions.value[4].name;
    // console.log("ratingDimensions", ratingDimensions.value);
    // console.log("ratingEvaluation", ratingEvaluation.value);

    fetchEval();
  };
  const fetchEval = async () => {
    const toolDemo = {
      username: "测试用户",
      tool: "ProcessOn",
      category: "流程图与思维导图",
      content_quality:
        "ProcessOn 是一款专业的在线绘图工具，其核心优势体现在建模能力、精准的自动对齐布局以及丰富的模板库，能够满足多种复杂场景的需求。",
      efficiency: "具备实时协作功能，支持多种文件格式的导出，提升了效率。",
      Convenience: "交互逻辑清晰，具备便捷的拖拽操作，同时兼容多终端访问。",
      payment: "提供不同层级的付费方案，以满足个人及企业用户的不同需求。",
      feedback_level:
        "提供详尽的文档与教程，有活跃的用户社区，确保产品持续优化。",
      averageScore: 4.9,
      comment:
        "ProcessOn 以其卓越的可视化能力和强大的协作功能，在流程图与思维导图领域树立了行业标杆，特别适用于产品设计、项目管理和业务流程优化场景。",
    };
    await axios
      .post("/llm/evaluate", ratingEvaluation.value)
      .then(async (resp) => {
        // console.log(resp.data.data);
        const reportText = resp.data.data.evaluation.choices[0].message.content;
        console.log(reportText);

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
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return { ratingDimensions, ratingEvaluation, evaluationAssign };
});
