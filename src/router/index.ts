import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/loginPage.vue"),
    },
    {
      path: "/form",
      name: "Form",
      component: () => import("@/pages/formPage.vue"),
    },
    {
      path: "/auth/student",
      name: "StudentLogin",
      component: () => import("@/pages/auth/studentLogin.vue"),
    },
    {
      path: "/auth/teacher",
      name: "TeacherLogin",
      component: () => import("@/pages/auth/teacherLogin.vue"),
    },
    {
      path: "/auth/admin",
      name: "AdminLogin",
      component: () => import("@/pages/auth/adminLogin.vue"),
    },
    {
      path: "/home",
      name: "MainLayout",
      component: () => import("@/pages/mainPage.vue"),
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("@/components/main/index.vue"),
        },
        {
          path: "/home/studentCourse",
          name: "StudentCourse",
          component: () => import("@/pages/student/course.vue"),
        },
        {
          path: "/home/studentEvals",
          name: "StudentEvals",
          component: () => import("@/pages/student/evals.vue"),
        },
        {
          path: "/home/studentInbox",
          name: "StudentInbox",
          component: () => import("@/pages/student/inbox.vue"),
        },
        {
          path: "/home/teacherCourse",
          name: "TeacherCourse",
          component: () => import("@/pages/teacher/course.vue"),
        },
        {
          path: "/home/teacherEvals",
          name: "TeacherEvals",
          component: () => import("@/pages/teacher/evals.vue"),
        },
        {
          path: "/home/teacherAssignments",
          name: "TeacherAssignments",
          component: () => import("@/pages/teacher/assignments.vue"),
        },
        {
          path: "/home/teacherGrading",
          name: "TeacherTeaching",
          component: () => import("@/pages/teacher/agent.vue"),
        },
        {
          path: "/home/stuList",
          name: "StuList",
          component: () => import("@/pages/admin/stuList.vue"),
        },
        {
          path: "/home/teaList",
          name: "TeaList",
          component: () => import("@/pages/admin/teaList.vue"),
        },
        {
          path: "/home/toolList",
          name: "ToolList",
          component: () => import("@/pages/admin/toolList.vue"),
        },
      ],
    },
    {
      path: "/detail",
      name: "Detail",
      component: () => import("@/pages/tool/detailPage.vue"),
    },
    {
      path: "/result",
      name: "EvalResult",
      component: () => import("@/pages/tool/evalResultPage.vue"),
    },
    {
      path: "/persona",
      name: "Persona",
      component: () => import("@/components/course/persona.vue"),
    },
  ],
});

let isInitialAuthCheckDone = false;

router.beforeEach((to, from) => {
  const authStore = useAuthStore();

  // 初始化时恢复用户登录状态
  if (!isInitialAuthCheckDone) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.token) {
          Object.assign(authStore.user, parsedUser);
          authStore.isAuthenticated = true;
          authStore.currentRole = parsedUser.role || authStore.currentRole;
          console.log("路由守卫：用户身份验证恢复成功", parsedUser.nickname);
        }
      } catch (error) {
        console.error("路由守卫：解析存储的用户数据失败", error);
        localStorage.removeItem("user");
      }
    }
    isInitialAuthCheckDone = true;
  }

  const authed = authStore.isAuthenticated;
  
  // 无需登录即可访问的路由
  const publicRoutes = [
    "/login",
    "/home",
    "/auth/student",
    "/auth/teacher",
    "/auth/admin",
    "/detail",
    "/result",
  ];

  const isPublicRoute = publicRoutes.some(route => 
    to.path === route || to.path.startsWith(route)
  );

  // 未登录时
  if (!authed) {
    // 允许访问公开路由
    if (isPublicRoute) {
      return true;
    }
    // 其他路由重定向到登录页
    return { name: "Login" };
  }

  // 已登录时
  // 访问登录相关页面时，根据角色重定向到对应首页
  if (to.path === "/login" || to.path.startsWith("/auth/")) {
    if (authStore.currentRole === "admin") {
      return "/home/stuList";
    } else if (authStore.currentRole === "teacher") {
      return "/home"; // 教师跳转到AI工具页面
    } else if (authStore.currentRole === "student") {
      return "/home"; // 学生跳转到AI工具页面
    }
  }

  // 访问根路径时，根据角色重定向
  if (to.path === "/") {
    if (authStore.currentRole === "admin") {
      return "/home/stuList";
    } else if (authStore.currentRole === "teacher") {
      return "/home"; // 教师跳转到AI工具页面
    } else {
      // 学生访问根路径时跳转到 AI工具页面
      return "/home";
    }
  }

  // 已登录的教师和管理员访问 /home 时，重定向到对应页面
  if (to.path === "/home" && authStore.currentRole === "admin") {
    return "/home/stuList";
  }
  // 教师访问 /home 时，直接显示 Home 组件（AI工具页面）
  // 不需要重定向，因为 /home 的子路由就是 Home

  // 其他情况正常访问
  return true;
});

export default router;
