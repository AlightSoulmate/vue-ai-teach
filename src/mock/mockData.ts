// mock/mockData.ts
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
// Mock.mock("/api/user", "put", (req) => {
//   const { nickname, username } = JSON.parse(req.body);
//   return {
//     Authorization: "jwt token",
//     user: {
//       id: Math.floor(Math.random() * 1000),
//       nickname,
//       username,
//       role: "xxx",
//       message: "用户信息修改成功",
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
// Mock.mock("/api/tools/{toolId}/ratings", "post", () => {
//   return {
//     message: "评分成功",
//   };
// });

// 1.5 管理员获取用户列表
Mock.mock("/api/auth", "post", (Authorization) => {
  if (Authorization) {
    return {
      students: [
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 20,
          nickname: "Luca",
          username: "cxt9",
        },
      ],
      teachers: [
        {
          id: 30,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "cxt9",
        },
        {
          id: 30,
          nickname: "Luca",
          username: "cxt9",
        },
      ],
    };
  }
});
