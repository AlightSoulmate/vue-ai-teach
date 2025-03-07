import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { nextTick } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          component: () => import("@/views/admin/studentManagePage.vue"),
        },
        {
          path: "adminTeacher",
          name: "AdminTeacher",
          component: () => import("@/views/admin/teacherManagePage.vue"),
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
          component: () => import("@/views/teacher/crousePage.vue"),
        },
        {
          path: "teacherInbox",
          name: "TeacherInbox",
          component: () => import("@/views/teacher/inboxPage.vue"),
        },
        {
          path: "studentCrouse",
          name: "StudentCrouse",
          component: () => import("@/views/student/crousePage.vue"),
        },
        {
          path: "studentInbox",
          name: "StudentInbox",
          component: () => import("@/views/student/inboxPage.vue"),
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
  if (to.name === "Login" && useAuthStore().isAuthenticated) {
    router.push("/");
  }
});

export default router;
