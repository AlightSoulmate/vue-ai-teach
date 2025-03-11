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
      component: () => import("@/views/loginPage.vue"),
    },
    {
      path: "/",
      name: "Index",
      component: () => import("@/views/mainPage.vue"),
      redirect: "/home",
      children: [
        {
          path: "home",
          name: "Home",
          component: () => import("@/components/main/index.vue"),
        },
        {
          path: "forum",
          name: "Forum",
          component: () => import("@/views/tool/forumPage.vue"),
        },
        {
          path: "studentCourse",
          name: "StudentCourse",
          component: () => import("@/views/student/course.vue"),
        },
        {
          path: "studentInbox",
          name: "StudentInbox",
          component: () => import("@/views/student/inbox.vue"),
        },
        {
          path: "teacherCourse",
          name: "TeacherCourse",
          component: () => import("@/views/teacher/course.vue"),
        },
        {
          path: "teacherInbox",
          name: "TeacherInbox",
          component: () => import("@/views/teacher/inbox.vue"),
        },
        {
          path: "stuList",
          name: "StuList",
          component: () => import("@/views/admin/stuList.vue"),
        },
        {
          path: "teaList",
          name: "TeaList",
          component: () => import("@/views/admin/teaList.vue"),
        },
        {
          path: "toolList",
          name: "ToolList",
          component: () => import("@/views/admin/toolList.vue"),
        },
        {
          path: "setup",
          name: "Setup",
          component: () => import("@/views/setupPage.vue"),
        },
      ],
    },
    {
      path: "/detail",
      name: "Detail",
      component: () => import("@/views/tool/detailPage.vue"),
    },
  ],
});

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  const auth = authStore.isAuthenticated;
  const LoginPage = {
    from: from.name === "Login",
    to: to.name === "Login",
  };
  if (auth && LoginPage.to && !LoginPage.from) {
    return { name: "Home" };
  }
  if (!auth && !LoginPage.to && LoginPage.from) {
    return { name: "Login" };
  }
});

export default router;
