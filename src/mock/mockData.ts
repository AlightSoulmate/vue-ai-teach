// mock/mockData.ts
import { id } from "element-plus/es/locales.mjs";
import Mock from "mockjs";

// 1.1 用户注册
Mock.mock("/api/user/register", "post", (req) => {
  const { username, role } = JSON.parse(req.body);
  return {
    Authorization: "jwt token",
    user: {
      id: Math.floor(Math.random() * 1000),
      nickname: "",
      username,
      role,
      message: "用户注册成功",
    },
  };
});

// 1.2 用户登录
Mock.mock("/api/user/login", "post", (req) => {
  const { username, role } = JSON.parse(req.body);
  return {
    Authorization: "jwt token",
    user: {
      id: Math.floor(Math.random() * 1000),
      nickname: Mock.Random.cname(),
      username,
      role,
      message: "用户登录成功",
    },
  };
});

// 1.3 管理员登录
Mock.mock("/api/auth/login", "post", (req) => {
  const { username, role } = JSON.parse(req.body);
  return {
    Authorization: "jwt token",
    user: {
      id: Math.floor(Math.random() * 1000),
      username,
      role,
      message: "用户登录成功",
    },
  };
});

// 1.4 用户修改信息
Mock.mock("/api/user", "put", (req) => {
  const { nickname, username } = JSON.parse(req.body);
  return {
    Authorization: "jwt token",
    user: {
      id: Math.floor(Math.random() * 1000),
      nickname,
      username,
      role: "xxx",
      message: "用户信息修改成功",
    },
  };
});

// 2.1 获取某一类别下的工具列表 不使用
// Mock.mock("/api/tools", "get", (options) => {
//   // 解析查询参数
//   const query = new URLSearchParams(options.url.split("?")[1]);
//   console.log(query);
//   const category = query.get("category");
//   // const category = options.url.split("=")[1];
//   console.log("请求的 category:", category);

//   // 筛选符合条件的工具
//   const result = tools.filter((tool) => tool.category === category);

//   return {
//     code: 200,
//     message: "成功",
//     data: result,
//   };
// });

// 2.1 获取类下工具详情
// const categories = ref<string[]>([]);

// Mock.mock(/\/api\/tools\?category=\w+/, (options: any) => {
//   const category = new URLSearchParams(options.url).get("category"); // 获取查询参数 category
//   const toolss = mockToolsData[category as keyof typeof mockToolsData] || []; // 根据 category 获取模拟数据

//   // 返回模拟的响应数据
//   return {
//     code: 200,
//     message: "请求成功",
//     data: {
//       tools: toolss,
//     },
//   };
// });

// 2.2 获取工具类别列表
Mock.mock("/api/tools/categories", "get", () => {
  return {
    categories: [
      "对话模型",
      "办公助手",
      "会议纪要",
      "脑图生成",
      "写作辅助",
      "翻译工具",
      "搜索引擎",
      "图像生成",
      "音频处理",
      "视频制作",
      "数字人",
    ],
  };
});

// 3.1 用户为工具打分
Mock.mock("/api/tools/{toolId}/ratings", "post", () => {
  return {
    message: "评分成功",
  };
});

// 5.1 上传作业
Mock.mock("/llm/evaluate", "post", () => {
  return {
    code: 200,
    message: "评估成功",
    data: {
      evaluation: {
        score: 85,
        overall_comment: "整体表现良好，有一些需要改进的地方",
        detailed_feedback: {
          strengths: ["文章结构清晰", "论述有理有据", "语言表达准确"],
          weaknesses: ["部分论据可以更充分", "结论部分可以更深入"],
        },
        suggestions: [
          "建议在论据部分增加更多具体例子",
          "可以在结论部分加入更多个人见解",
          "建议注意段落之间的过渡连接",
        ],
        rubric_scores: {
          content: 8.5,
          organization: 8.0,
          language: 9.0,
          critical_thinking: 8.5,
        },
      },
    },
  };
});
