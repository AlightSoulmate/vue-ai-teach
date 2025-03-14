// mock/mockData.ts
import Mock from "mockjs";

// 1.1 用户注册
Mock.mock("/api/user/register", "post", (req) => {
  const { username, role } = JSON.parse(req.body);
  console.log("mock用户注册", req.body);
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
  console.log("mock用户登录", req.body);
  return {
    Authorization: "jwt token",
    user: {
      id: Math.floor(Math.random() * 1000),
      nickname: Mock.Random.cname(),
      username,
      role,
      message: "用户登录成功",
      is_fresh: 1,
    },
  };
});

// 1.3 管理员登录
Mock.mock("/api/auth/login", "post", (req) => {
  const { username, role } = JSON.parse(req.body);
  console.log("mock管理员登录", req.body);
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

// 2.2 获取工具类别列表
Mock.mock("/api/tools/categories", "get", () => {
  console.log("mock获取工具类别列表");
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

//2.7 上传评分
Mock.mock(new RegExp(`/api/tools/\\d+/ratings`), "post", (options: any) => {
  console.log("mock上传评分", options);
  const match = options.url.match(/\/api\/tools\/(\d+)\/ratings/);
  if (!match) {
    return {
      message: "请求路径不正确",
    };
  }
  const toolId = match[1];
  const body = JSON.parse(options.body);
  if (
    !body.Authorization ||
    !body.rate ||
    typeof body.rate.rating !== "number"
  ) {
    return {
      message: "缺少必要的评分数据",
    };
  }
  console.log(`工具 ${toolId} 评分成功:`, body.rate);
  return {
    message: "评分提交成功",
  };
});

//2.3 获取工具详情
Mock.mock(new RegExp(`/api/tools/\\d+`), "get", (options: any) => {
  console.log("mock获取工具详情", options);
  const toolId = options.url.match(/\/api\/tools\/(\d+)/)[1];
  return {
    id: Number(toolId),
    name: "AiPPT",
    category: "办公助手",
    cat_id: 4,
    url: "https://www.aippt.cn",
    logoUrl: "xxx",
    description: "自动生成PPT大纲、模板、Word-PPT……",
    score: 4.5,
    ratingCount: 200,
    rates: [
      //评分列表
      {
        user: Mock.Random.cname(), //昵称
        rating: 5, //评分
        comment:
          "GitHub, Inc. 成立于 2008 年，最初是一家独立的公司，专注于提供基于 Git 的代码托管和协作开发平台。2018 年 微软以 75 亿美元的价格收购了 GitHub，将其纳入微软生态，但 GitHub 仍然保持独立运营，并继续支持开源社区和开发者。", //评价
      },
      {
        user: Mock.Random.cname(),
        rating: 3.5,
        comment: "comment-two",
      },
      {
        user: Mock.Random.cname(),
        rating: 5,
        comment: "comment-three",
      },
      {
        user: Mock.Random.cname(),
        rating: 4.5,
        comment:
          "在 CORS（跨域资源共享，Cross-Origin Resource Sharing） 机制中，HTTP 请求被分为 简单请求（Simple Request）和 预检请求（Preflight Request）。它们用于处理浏览器向不同源（跨域）发送请求时的安全性校验。",
      },
      {
        user: Mock.Random.cname(),
        rating: 2.5,
        comment: "comment-five",
      },
      {
        user: Mock.Random.cname(),
        rating: 1.5,
        comment: "comment-six",
      },
      {
        user: Mock.Random.cname(),
        rating: 1.5,
        comment: "comment-seven",
      },
      {
        user: Mock.Random.cname(),
        rating: 5,
        comment: "comment-eight",
      },
      {
        user: Mock.Random.cname(),
        rating: 4,
        comment: "comment-nine",
      },
      {
        user: Mock.Random.cname(),
        rating: 1.5,
        comment: "comment-ten",
      },
      {
        user: Mock.Random.cname(),
        rating: 5,
        comment: "comment-eleven",
      },
      {
        user: Mock.Random.cname(),
        rating: 4,
        comment: "comment-twelve",
      },
    ],
  };
});

// 1.5 管理员获取用户列表
Mock.mock("/api/auth", "post", (Authorization) => {
  console.log("mock管理员获取用户列表", Authorization);
  if (Authorization) {
    return {
      students: [
        {
          id: 20,
          nickname: "Luca",
          username: "23080501001",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501002",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501003",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501004",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501005",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501006",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501007",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501008",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501009",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "23080501010",
        },
      ],
      teachers: [
        {
          id: 30,
          nickname: "Luca",
          username: "23080501011",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "23080501012",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "23080501013",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "23080501014",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "23080501015",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "23080501016",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "23080501017",
        },
      ],
    };
  }
});
