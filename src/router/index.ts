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
      path: "/",
      name: "Login",
      component: () => import("@/views/loginPage.vue"),
    },
    {
      path: "/index",
      name: "Index",
      component: () => import("../views/mainPage.vue"),
      redirect: "/index/home",
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

// 添加全局导航守卫
router.afterEach((to, from, next) => {
  // 强制刷新页面
  const scrollPosition = window.scrollY;

  // next(() => {
  // 使用 nextTick 确保DOM更新后再执行
  if (
    (from.name && (to.name === "Login" || to.name === "Detail")) ||
    (from.name === "Detail" && to.name === "Home") ||
    (from.name === "Login" && to.name === "Home")
  ) {
    nextTick(() => {
      // 恢复滚动位置
      window.scrollTo(0, scrollPosition);
      // 强制重新渲染
      window.location.reload();
    });
  }
  // });
  // 如果不是首次加载（from.name存在）
  // if (from.name) {
  //   // 保存当前的滚动位置
  //   const scrollPosition = window.scrollY;

  //   // 强制刷新页面
  //   next(() => {
  //     // 使用 nextTick 确保DOM更新后再执行
  //     nextTick(() => {
  //       // 恢复滚动位置
  //       window.scrollTo(0, scrollPosition);
  //       // 强制重新渲染
  //       window.location.reload();
  //     });
  //   });
  // } else {
  //   next();
  // }
});

export default router;
