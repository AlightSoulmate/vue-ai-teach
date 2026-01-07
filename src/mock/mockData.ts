// mock/mockData.ts
import Mock from "mockjs";
// 从项目根目录下的 backup 目录引入（当前文件位于 src/router/mock）
// ../../backup 指向 src/backup（不存在），应当返回到项目根再进入 backup
import toolsData from "../../backup/ai_tools.json";

const tools = {
    value: toolsData,
};
// =============== 内存中的作业数据（仅Mock） ===============
// 教师“作业列表”数据源（返回给 /api/homeworks）
const homeworksStore: any[] = [];
// 教师“我的作业（管理页）”可选数据（未启用的接口保留）
const assignmentsStore: any[] = [];
// 学生收件箱映射（基于作业生成简化视图）
const inboxStore: any[] = [];


console.log("开发环境 tools 检查:", {
    toolsExists: !!tools,
    toolsValueExists: !!(tools && tools.value),
    toolsLength: tools?.value?.length,
});

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
            cno: "未归属",
            message: "用户注册成功",
        },
    };
});

// 1.2 用户登录
Mock.mock("/api/user/login", "post", (req) => {
    const { username, role } = JSON.parse(req.body);
    console.log("mock用户登录", req.body);
    let CNO = "23计算机一班";
    if (role === "teacher") CNO = "";
    return {
        Authorization: "jwt token",
        user: {
            id: Math.floor(Math.random() * 1000),
            nickname: Mock.Random.cname(),
            username,
            role,
            message: "用户登录成功",
            is_fresh: 1,
            cno: CNO
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

// 1.4 用户修改个人信息
Mock.mock("/api/user", "post", (req) => {
    console.log("mock用户修改个人信息");
    const { password, nickname, username } = JSON.parse(req.body);

    return {
        Authorization: "jwt token",
        user: {
            id: Math.floor(Math.random() * 1000),
            nickname,
            username,
            message: "用户信息修改成功",
        },
    };
});

// 1.5 管理员获取用户列表
Mock.mock("/api/auth", "get", (Authorization) => {
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

// 1.6 管理员新增用户
Mock.mock(new RegExp("/api/auth\\?role=(teacher|student)"), "put", (req) => {
    console.log("mock管理员新增用户", req.body);

    return {
        message: "用户新增成功",
    };
});

// 1.7 管理员修改用户信息
Mock.mock(
    new RegExp("/api/auth\\?id=\\d+&role=(teacher|student)"),
    "post",
    (req) => {
        console.log("mock管理员修改用户信息", req.body);
        const urlParams = new URLSearchParams(req.url.split("?")[1]);
        const id = urlParams.get("id");
        const role = urlParams.get("role");

        console.log(`mock修改${role}用户，ID: ${id}的信息`);

        return {
            message: "用户信息修改成功",
        };
    }
);

// 1.8 管理员删除用户
Mock.mock(
    new RegExp("/api/auth\\?id=\\d+&role=(teacher|student)"),
    "post",
    (req) => {
        console.log("mock管理员删除用户", req.body);
        const urlParams = new URLSearchParams(req.url.split("?")[1]);
        const id = urlParams.get("id");
        const role = urlParams.get("role");
        console.log(`删除${role}用户，ID: ${id}`);
        return {
            message: "用户删除成功",
        };
    }
);

// 1.9 管理员查询用户
Mock.mock(
    new RegExp("/api/auth\\?username=[^&]+&role=(teacher|student)"),
    "post",
    (req) => {
        console.log("mock管理员查询用户", req.body);
        const urlParams = new URLSearchParams(req.url.split("?")[1]);
        const username = urlParams.get("username");
        const role = urlParams.get("role");
        console.log(`查询${role}，用户名: ${username}`);
        return {
            user: {
                id: Math.floor(Math.random() * 1000),
                nickname: "Luca",
                username,
                password: "123456",
                role,
            },
        };
    }
);

// 1.10 用户上传评价文件
Mock.mock("/api/evaluation/upload", "post", (req) => {
    console.log("mock用户上传评价文件", req.body);
    try {
        const formData = req.body;
        const file = formData.get("file");
        const Authorization = formData.get("Authorization");

        if (!file || !Authorization) {
            return {
                message: "缺少必要的文件或授权信息",
            };
        }

        return {
            message: "上传成功",
        };
    } catch (error) {
        return {
            message: "请求格式错误，需要 multipart/form-data 格式",
        };
    }
});

// 1.11 获得大模型对用户评价文件的评价
Mock.mock("/api/evaluation", "post", (req) => {
    console.log("mock获得大模型对用户评价文件的评价", req.body);
    return {
        message: "评价成功",
    };
});

// 1.12 获取用户历史上传的评价报告
Mock.mock("/api/evaluation/history", "post", (req) => {
  console.log("mock获取用户历史上传的评价报告", req.body);

  return {
    history: [
      {
        id: 1,
        fileName: "AI工具评测报告.docx",
        uploadTime: "2024-04-01 14:30:45",
        toolName: "ChatGPT",
        evaluationResult: "优秀",
        downloadUrl: "/reports/report1.docx",
      },
      {
        id: 2,
        fileName: "Midjourney使用评价.docx",
        uploadTime: "2024-03-25 09:12:30",
        toolName: "Midjourney",
        evaluationResult: "良好",
        downloadUrl: "/reports/report2.docx",
      },
      {
        id: 3,
        fileName: "Claude评测报告.pdf",
        uploadTime: "2024-03-10 16:45:22",
        toolName: "Claude",
        evaluationResult: "优秀",
        downloadUrl: "/reports/report3.pdf",
      },
    ],
  };
});

// 2.1 获取某一类别下的工具列表
Mock.mock(new RegExp("/api/tools\\?category=.+"), "get", (options) => {
    console.log("mock获取某一类别下的工具列表", options);
    const urlParams = new URLSearchParams(options.url.split("?")[1]);
    const category = decodeURIComponent(urlParams.get("category") || "");
    console.log("请求的类别:", category);

    if (!tools || !tools.value) {
        console.error("tools.value 未定义");
        return {
            tools: [],
        };
    }

    const filteredTools = tools.value.filter(
        (tool: any) => tool.category === category
    );

    return {
        tools: filteredTools,
    };
});

// 2.2 获取工具类别列表
Mock.mock("/api/tools/categories", "get", () => {
    console.log("mock获取工具类别列表");
    return {
        categories: [...new Set(tools.value.map((tool: any) => tool.category))],
    };
});

// 2.3 获取工具详情      
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
                user: Mock.Random.cname(),
                rating: 5,
                comment:
                    "豆包的回答非常准确，能够很好地理解我的问题，并且提供了详细的解释。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 3.5,
                comment:
                    "智谱清言在技术问题上的回答很专业，但在一些日常问题上表现一般。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 5,
                comment:
                    "DeepSeek的代码能力很强，能够快速生成高质量的代码，非常推荐给开发者使用。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 4.5,
                comment: "豆包在中文处理方面表现优秀，能够很好地理解中文语境。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 2.5,
                comment: "智谱清言的响应速度有时较慢，但回答质量还是不错的。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 1.5,
                comment: "DeepSeek在某些专业领域的知识还不够全面，需要继续改进。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 1.5,
                comment: "豆包在回答复杂问题时有时会偏离主题，需要更精准的回答。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 5,
                comment: "智谱清言在学术研究方面提供了很多有价值的参考。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 4,
                comment: "DeepSeek的界面设计很友好，使用起来很流畅。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 1.5,
                comment: "豆包在回答一些技术问题时显得不够专业。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 5,
                comment: "智谱清言的多语言支持做得很好，可以处理多种语言的问题。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
            {
                user: Mock.Random.cname(),
                rating: 4,
                comment: "DeepSeek的学习能力很强，能够根据用户反馈不断改进。",
                cno: "23计算机一班",
                rate_time: "2025-05-19 22:10:35"
            },
        ],
    };
});

// 2.4 添加新工具（管理员）
Mock.mock("/api/tools", "post", (req) => {
    console.log("mock添加新工具", req.body);
    return {
        message: "工具添加成功",
    };
});

//2.5 更新工具信息（管理员）
Mock.mock(new RegExp(`/api/tools/\\d+`), "put", (req) => {
    console.log("mock更新工具信息", req.body);
    return {
        message: "工具信息更新成功",
    };
});

//2.6 删除工具（管理员）
Mock.mock(new RegExp(`/api/tools/\\d+`), "delete", (req) => {
    console.log("mock删除工具", req.body);
    return {
        message: "工具删除成功",
    };
});

//2.7 上传评分
Mock.mock(new RegExp(`/api/tools/\\d+/ratings`), "post", (options: any) => {
    console.log("mock上传评分", options);
    const match = options.url.match(/\/api\/tools\/(\d+)\/ratings/);

    const toolId = match[1];
    const body = JSON.parse(options.body);
    console.log(`工具 ${toolId} 评分成功:`, body.rate);
    return {
        message: "评分提交成功",
    };
});

//2.8 工具搜索功能
Mock.mock("/api/tools/search", "get", (req) => {
    console.log("mock工具搜索", req.body);
    return {
        data: [
            {
                id: 1,
                name: "AiPPT",
                category: "办公助手",
                cat_id: 4,
                url: "https://www.aippt.cn",
                logoUrl: "asdas",
                description: "自动生成PPT大纲、模板、Word-PPT……",
                score: 4.5,
                ratingCount: 200,
            },
        ],
    };
});

// 4.1 获取班级列表
Mock.mock("/api/class", "get", () => {
    console.log("mock获取班级列表");
    return {
        classes: [
            {
                id: 1,
                name: "23计算机一班"
            },
            {
                id: 2,
                name: "23电商一班"
            },
            {
                id: 3,
                name: "24计算机一班"
            },
            {
                id: 4,
                name: "24跨电一班"
            }
        ]
    }
});

// 4.2 获取历史评价记录
Mock.mock("/api/ratings", "get", () => {
    console.log("mock获取历史评价记录");
    return {
        rates: [
            {
                id: 1,
                user: Mock.Random.cname(),
                rating: 5,
                comment: "评价内容1",
                rate_time: "2024-03-25 09:12:30",
                tool_id: "1",
            },
            {
                id: 2,
                user: Mock.Random.cname(),
                rating: 5,
                comment: "评价内容2",
                rate_time: "2024-03-25 09:12:30",
                tool_id: "2",
            },
        ],
    };
});

// 3.1 查看教师的所有课程
Mock.mock("/api/courses", "get", () => {
    console.log("mock查看教师的所有课程");
    return {
        courses: [
            {
                id: 1,
                course: "计算机导论",
                description: "description 1",
                cno: [
                    "23计算机一班",
                    "23计算机二班",
                ]
            },
            {
                id: 2,
                course: "数据结构",
                description: "description 2",
                "cno": [
                    "23电商一班",
                    "23电商二班",
                ]
            },
        ],
    };
});

// 3.4 教师添加课程
Mock.mock("/api/course", "post", (req) => {
    console.log("mock教师添加课程", req.body);
    return {
        message: "课程添加成功",
        course_id: Math.floor(Math.random() * 1000),
        cno: [
            "23计算机一班",
            "24电商一班"
        ]
    };
});

// 3.5 教师修改课程
Mock.mock(new RegExp("/api/course/\\d+"), "put", (req) => {
    console.log("mock教师修改课程", req.body);
    return {
        message: "课程修改成功",
    };
});

// 5.1 给某一班级的所有同学发布一条作业
Mock.mock("/api/homework", "post", (options: any) => {
    try {
        const body = JSON.parse(options.body);
        console.log("mock发布作业", body);
        const courseId = body.course_id;
        const hw = body.homework || {};
        if (!courseId || !hw.title || !hw.push_date || !hw.end_date) {
            return { message: "缺少必要字段" };
        }
        // 将作业写入教师端"已发布作业"数据源
        const newHomework = {
            course_id: courseId,
            homework_id: Math.floor(Math.random()*1000000),
            title: hw.title,
            description: hw.description || "",
            push_date: hw.push_date,
            end_date: hw.end_date,
            is_reviewed: false,
            submit_count: 0,
            student_count: 45
        };
        homeworksStore.unshift(newHomework);

        // 可选写入教师 assignmentsStore（当前页面未使用）
        assignmentsStore.unshift({
            id: Date.now(),
            title: hw.title,
            description: hw.description || "",
            type: "标准",
            status: "已发布",
            courseId: courseId,
            courseName: "",
            classId: 0,
            className: "",
            dueDate: hw.end_date,
            maxScore: 100,
            requirements: "",
            createdAt: hw.push_date,
            updatedAt: hw.push_date,
        });
        // 同步映射到学生收件箱
        inboxStore.unshift({
            id: Date.now(),
            homework_id: Math.floor(Math.random()*100000),
            title: hw.title,
            push_date: hw.push_date,
            is_done: false,
            commit_data: null
        });
        return {
            message: "上传成功",
        };
    } catch (e) {
        return { message: "请求体需为JSON" };
    }
});

// 获取教师作业列表
Mock.mock("/api/teacher/assignments", "get", () => {
    return {
        assignments: assignmentsStore,
        stats: {
            totalAssignments: assignmentsStore.length,
            publishedAssignments: assignmentsStore.filter(a=>a.status==="已发布").length,
            draftAssignments: 0,
            closedAssignments: 0,
            totalSubmissions: 0,
            gradedSubmissions: 0,
        }
    }
});

// 5.2 学生收件箱：返回所有作业及提交记录
Mock.mock("/api/inbox", "get", () => {
    return {
        message: "查询成功",
        homework: inboxStore.map(item => ({
            id: item.id,
            homework_id: item.homework_id,
            title: item.title,
            push_date: item.push_date,
            is_done: !!item.is_done,
            commit_data: item.is_done ? item.commit_data : null
        }))
    }
});

// 5.3 教师查看特定课程的所有已发布作业
Mock.mock(/\/(api\/)?homeworks(\?.*)?$/, "get", (options: any) => {
    console.log("mock教师查看特定课程的所有已发布作业", options.url);

    // 解析URL参数获取course_id
    const fullUrl = options.url.startsWith('http') ? options.url : `http://localhost${options.url}`;
    const url = new URL(fullUrl);
    const courseId = url.searchParams.get('course_id');

    // 如果首次为空，预置一些示例数据
    if (homeworksStore.length === 0) {
        homeworksStore.push(
            {
                course_id: 1,
                homework_id: 1,
                title: "数据库设计实验",
                description: "请设计一个学生管理系统的数据库，包括学生表、课程表、成绩表等，并完成ER图设计。",
                push_date: "2024-12-01 09:00:00",
                end_date: "2024-12-15 23:59:59",
                is_reviewed: false,
                submit_count: 28,
                student_count: 45
            },
            {
                course_id: 1,
                homework_id: 2,
                title: "SQL查询练习",
                description: "基于提供的数据库，完成以下SQL查询语句的编写：1. 查询所有学生的基本信息 2. 统计各科成绩分布 3. 找出成绩优秀的学生",
                push_date: "2024-11-20 14:30:00",
                end_date: "2024-12-05 18:00:00",
                is_reviewed: true,
                submit_count: 42,
                student_count: 45
            },
            {
                course_id: 2,
                homework_id: 3,
                title: "Java编程作业",
                description: "完成一个简单的学生管理系统，包括增删改查功能",
                push_date: "2024-12-10 10:00:00",
                end_date: "2024-12-25 23:59:59",
                is_reviewed: false,
                submit_count: 15,
                student_count: 30
            }
        );
    }

    // 根据course_id过滤作业
    let filteredHomeworks = homeworksStore;
    if (courseId) {
        filteredHomeworks = homeworksStore.filter(hw => hw.course_id === parseInt(courseId));
    }

    return {
        message: "查询成功",
        homeworks: filteredHomeworks
    };
});

// 5.4 教师查看某一作业提交情况
Mock.mock(/\/(api\/)?homeworks\/\d+$/, "get", (options: any) => {
    const match = options.url.match(/\/homeworks\/(\d+)/);
    const homeworkId = match ? Number(match[1]) : 0;
    console.log("mock查看某一作业提交情况", { homeworkId });

    const classMap: Record<number, { class_id: number; class_name: string }> = {
        1: { class_id: 1, class_name: "23计算机一班" },
        2: { class_id: 2, class_name: "23电商一班" },
        3: { class_id: 3, class_name: "24计算机一班" }
    };
    const cls = classMap[(homeworkId % 3) + 1];

    const students = [
        {
            id: 1,
            username: "22080601035",
            nickname: "陈先涛",
            class_id: cls.class_id,
            class_name: cls.class_name,
            is_done: true,
            is_reviewed: true,
            score: 90,
            submit_record_id: 59
        },
        {
            id: 2,
            username: "22080601036",
            nickname: "张三",
            class_id: cls.class_id,
            class_name: cls.class_name,
            is_done: true,
            is_reviewed: false,
            score: null,
            submit_record_id: null
        },
        {
            id: 3,
            username: "22080601037",
            nickname: "李四",
            class_id: cls.class_id,
            class_name: cls.class_name,
            is_done: false,
            is_reviewed: false,
            score: null,
            submit_record_id: null
        },
        {
            id: 4,
            username: "22080601038",
            nickname: "王五",
            class_id: cls.class_id,
            class_name: cls.class_name,
            is_done: true,
            is_reviewed: true,
            score: 76,
            submit_record_id: 61
        },
        {
            id: 5,
            username: "22080601039",
            nickname: "赵六",
            class_id: cls.class_id,
            class_name: cls.class_name,
            is_done: true,
            is_reviewed: false,
            score: null,
            submit_record_id: 62
        }
    ];

    return {
        message: "查询成功",
        students
    };
});

// 5.5 学生提交作业
Mock.mock(/\/(api\/)?homework\/\d+$/, "post", (options: any) => {
    try {
        const match = options.url.match(/\/homework\/(\d+)/);
        const id = match ? Number(match[1]) : 0;
        const now = new Date();
        const commit_date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

        const idx = inboxStore.findIndex((x:any)=>x.homework_id===id);
        if (idx >= 0) {
            inboxStore[idx].is_done = true;
            inboxStore[idx].commit_data = { commit_date, is_reviewed: false, score: null };
        }
        return { message: "上传成功" };
    } catch (e) {
        return { message: "上传失败" };
    }
});

// 3.13 教师获取学生工具评价
Mock.mock(new RegExp("/api/class/ratings/\\d+"), "get", (req) => {
    console.log("mock教师获取课程评价", req.body);
    return {
        message: "查询成功",
        rates: [
            {
                username: "23080501024",
                user: Mock.Random.cname(),
                rating: 5,
                comment: "评价内容1",
                rate_time: "2024-03-25 09:12:30",
                tool_id: "1",
            },
            {
                username: "23080501044",
                user: Mock.Random.cname(),
                rating: 5,
                comment: "评价内容2",
                rate_time: "2024-03-25 09:12:30",
                tool_id: "2",
            },
        ],
    };
});

// 1.12 获取个人历史作业记录
Mock.mock("/api/evaluate/history", "get", (req) => {
    console.log("mock获取个人历史作业记录", req.body);
    return {
        message: "查询成功",
        history: [
            {
                toolid: 1,
                datetime: "2025-04-01 06:18",
                content: "content 1"
            },
            {
                toolid: 2,
                datetime: "2025-05-21 15:44",
                content: "content 2"
            },
            {
                toolid: 3,
                datetime: "2025-06-01 11:30",
                content: "content 3"
            },
            {
                toolid: 4,
                datetime: "2025-06-03 22:40",
                content: "content 4"
            },
            {
                toolid: 5,
                datetime: "2025-06-05 14:58",
                content: "content 5"
            },
        ]
    };
});

// 1.14 获取特定班级的历史评价记录的数量和提交次数的数量
Mock.mock(new RegExp("/api/student/history/\\d+"), "get", (req) => {
    console.log("mock获取特定班级的历史评价记录的数量和提交次数的数量", req.body);
    return {
        message: "查询成功",
        users: [
            {
                username: "22080601035",
                nickname: "cxt1",
                report: 3,
                review: 5
            }, {
                username: "22080601036",
                nickname: "cxt2",
                report: 3,
                review: 12
            }, {
                username: "22080601037",
                nickname: "cxt3",
                report: 1,
                review: 4
            }, {
                username: "22080601038",
                nickname: "cxt4",
                report: 6,
                review: 8
            },
        ]
    };
});

// 4.4 获取特定学生历史评价记录
Mock.mock("/api/rating/history", "get", () => {
    console.log("mock获取特定学生历史评价记录");
    return {
        rates: [
            {
                id: 1,
                user: "ycy",
                rating: 5,
                comment: "11asdas",
                rate_time: "2025-05-19 22:10:35",
                tool_id: "1"
            },
            {
                id: 2,
                user: "ycy",
                rating: 5,
                comment: "22asdas",
                rate_time: "2025-05-19 22:10:35",
                tool_id: "1"
            },
        ]
    };
});

// 4.4 获取特定学生历史报告记录
Mock.mock("/api/evaluate/history", "get", () => {
    console.log("mock获取特定学生历史报告记录");
    return {
        message: "查询成功",
        history: [
            {
                toolid: 1,
                datetime: "2025-06-04 16:30",
                content: "111asdasddsfds"
            },
            {
                toolid: 2,
                datetime: "2025-06-05 10:15",
                content: "222asdasddsfds"
            },
            {
                toolid: 3,
                datetime: "2025-06-06 14:45",
                content: "333asdasddsfds"
            },
            {
                toolid: 4,
                datetime: "2025-06-07 09:30",
                content: "444asdasddsfds"
            },
        ]
    };
});
// ========= 5.6 / 5.7 AI 批改 Mock =========
interface ReviewTask {
  submit_record_id: number
  status: 'processing' | 'done'
  score: number | null
  pollCount: number
}
const reviewTasks: Record<string, ReviewTask> = {}

// 5.6 提交到 AI 批改
Mock.mock('/api/homework/review', 'post', () => {
  const uuid = Mock.Random.guid()
  reviewTasks[uuid] = {
    submit_record_id: 0,
    status: 'processing',
    score: null,
    pollCount: 0,
  }
  return { message: '已提交至ai批改', uuid }
})

// 5.7 轮询批改结果
Mock.mock(/\/api\/homework\/review(\?.*)?$/, 'get', (opt: any) => {
  const url = new URL(opt.url, 'http://localhost')
  const uuid = url.searchParams.get('mission_uid') || ''
  const t = reviewTasks[uuid]
  if (!t) return { status: 202, message: '正在处理' }

  t.pollCount++
  if (t.pollCount < 3)
    return { status: 202, message: '正在处理' }

  if (t.status !== 'done') {
    t.status = 'done'
    t.score = Mock.Random.integer(60, 100)
  }
  return { message: '该任务已完成', score: t.score }
})
// ========= END AI 批改 Mock =========