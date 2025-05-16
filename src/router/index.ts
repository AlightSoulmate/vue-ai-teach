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
      path: "/",
      name: "Index",
      component: () => import("@/pages/mainPage.vue"),
      children: [
        {
          path: "home",
          name: "Home",
          component: () => import("@/components/main/index.vue"),
        },
        {
          path: "history",
          name: "History",
          component: () => import("@/pages/tool/historyPage.vue" as any) ,
        },
        {
          path: "forum",
          name: "Forum",
          component: () => import("@/pages/tool/forumPage.vue"),
        },
        {
          path: "studentCourse",
          name: "StudentCourse",
          component: () => import("@/pages/student/course.vue"),
        },
        {
          path: "studentInbox",
          name: "StudentInbox",
          component: () => import("@/pages/student/inbox.vue"),
        },
        {
          path: "teacherCourse",
          name: "TeacherCourse",
          component: () => import("@/pages/teacher/course.vue"),
        },
        {
          path: "teacherInbox",
          name: "TeacherInbox",
          component: () => import("@/pages/teacher/inbox.vue"),
        },
        {
          path: "stuList",
          name: "StuList",
          component: () => import("@/pages/admin/stuList.vue"),
        },
        {
          path: "teaList",
          name: "TeaList",
          component: () => import("@/pages/admin/teaList.vue"),
        },
        {
          path: "toolList",
          name: "ToolList",
          component: () => import("@/pages/admin/toolList.vue"),
        },
        {
          path: "setup",
          name: "Setup",
          component: () => import("@/pages/setupPage.vue"),
        },
      ],
    },
    {
      path: "/detail",
      name: "Detail",
      component: () => import("@/pages/tool/detailPage.vue"),
    },
  ],
});

let isInitialAuthCheckDone = false;

router.beforeEach((to, from) => {
  const authStore = useAuthStore();

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
  const loginPage = {
    from: from.name === "Login",
    to: to.name === "Login",
    toForm: to.name === "Form",
  };

  if (!authed && !loginPage.to && !loginPage.toForm) {
    return { name: "Login" };
  } else if (authed && loginPage.to && !loginPage.from) {
    if (authStore.currentRole === "admin") {
      return { name: "StuList" };
    } else {
      return { name: "Home" };
    }
  } else if (
    authed &&
    (to.path === "/" || to.name === "Index" || to.path === "/home")
  ) {
    if (authStore.currentRole === "admin") {
      return { name: "StuList" };
    } else if (to.path === "/" || to.name === "Index") {
      return { name: "Home" };
    }
  }

  return true;
});

export default router;
