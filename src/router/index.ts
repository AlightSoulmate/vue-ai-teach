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
          path: "adminStudent",
          name: "AdminStudent",
          component: () => import("@/views/admin/studentManage.vue"),
        },
        {
          path: "adminTeacher",
          name: "AdminTeacher",
          component: () => import("@/views/admin/teacherManage.vue"),
        },
        {
          path: "adminTool",
          name: "AdminTool",
          component: () => import("@/views/admin/toolManage.vue"),
        },
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
          path: "teacherCrouse",
          name: "TeacherCrouse",
          component: () => import("@/views/teacher/course.vue"),
        },
        {
          path: "teacherInbox",
          name: "TeacherInbox",
          component: () => import("@/views/teacher/inbox.vue"),
        },
        {
          path: "studentCrouse",
          name: "StudentCrouse",
          component: () => import("@/views/student/course.vue"),
        },
        {
          path: "studentInbox",
          name: "StudentInbox",
          component: () => import("@/views/student/inbox.vue"),
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
  const isToLoginPage = to.name === "Login";

  if (isToLoginPage && authStore.isAuthenticated) {
    return { name: "Home" };
  }
  if (!isToLoginPage && !authStore.isAuthenticated) {
    return { name: "Login" };
  }
});

export default router;
