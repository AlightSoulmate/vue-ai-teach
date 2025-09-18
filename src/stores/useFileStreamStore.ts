// @/stores/useFileStreamStore.ts
import { defineStore } from "pinia";
import { Document, Packer, Paragraph, TextRun } from "docx";

const generateScoreDetails = (evalData: any) => {
  const sections = [
    {
      title: "基础信息评分",
      score: evalData.basic_info.basic_score,
      items: [
        { name: "目标对象", value: evalData.basic_info.object },
        { name: "分类准确性", value: evalData.basic_info.category },
        { name: "使用场景", value: evalData.basic_info.using },
        { name: "选择理由", value: evalData.basic_info.rationale },
      ]
    },
    {
      title: "核心功能评分",
      score: evalData.core_function.core_score,
      items: [
        { name: "功能完整性", value: evalData.core_function.function },
        { name: "效果评估", value: evalData.core_function.effect_evaluation },
        { name: "改进建议", value: evalData.core_function.recommend },
      ]
    },
    {
      title: "用户体验评分",
      score: evalData.user_experience.experience_score,
      items: [
        { name: "操作效率", value: evalData.user_experience.operation_efficiency },
        { name: "错误处理", value: evalData.user_experience.error_handling },
        { name: "文档支持", value: evalData.user_experience.document_support },
      ]
    },
    {
      title: "实用价值评分",
      score: evalData.practical_value.practical_score,
      items: [
        { name: "成本效益", value: evalData.practical_value.cost_effectiveness },
        { name: "场景适应性", value: evalData.practical_value.scenario_adaptability },
      ]
    },
    {
      title: "结论评分",
      score: evalData.conclusion.conclusion_score,
      items: [
        { name: "优缺点分析", value: evalData.conclusion.strength_weakness },
        { name: "应用场景", value: evalData.conclusion.scenario },
      ]
    }
  ];

  return sections.flatMap(section => [
    new Paragraph({
      children: [
        new TextRun({ text: `${section.title}（${section.score}分）`, bold: true, size: 28 }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    ...section.items.map(item => new Paragraph({
      children: [
        new TextRun({ text: `${item.name}：${item.value}分`, size: 24 }),
      ],
    }))
  ]);
};

export const useFileStreamStore = defineStore("fileStream", {
  state: () => ({}),

  actions: {
    async downloadReport(data: any) {
      try {
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              // 标题
              new Paragraph({
                children: [
                  new TextRun({
                    text: "AI 教学工具评价报告",
                    bold: true,
                    size: 32,
                  }),
                ],
                spacing: { after: 400 },
                alignment: "center",
              }),

              // 用户信息
              new Paragraph({
                children: [
                  new TextRun({ text: `提交用户：${data.userInfo.nickname}（${data.userInfo.username}）`, size: 24 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `所属班级：${data.userInfo.className}`, size: 24 }),
                ],
              }),

              // 总分和总结
              new Paragraph({
                children: [
                  new TextRun({ text: `总分：${data.evalData.total_score}`, bold: true, size: 28 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "总结评价：", bold: true, size: 24 }),
                  new TextRun({ text: data.evalData.summary, size: 24 }),
                ],
                spacing: { after: 400 },
              }),

              // 各部分详细评分
              ...generateScoreDetails(data.evalData),
            ],
          }],
        });

        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AI教学工具评价报告_${data.userInfo.username}_${new Date().getTime()}.docx`;

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 0);
      } catch (error) {
        console.error('生成文档失败：', error);
        throw error;
      }
    }
  }
});
