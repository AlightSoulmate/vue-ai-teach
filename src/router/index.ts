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
  // if (!auth && !LoginPage.to && LoginPage.from) {
  //   return { name: "Login" };
  // }
});

export default router;
