import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: () => import("@/views/loginPage.vue"),
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("../views/mainPage.vue"),
    },
    {
      path: "/detail",
      name: "Detail",
      component: () => import("@/views/detailPage.vue"),
    },
  ],
});

export default router;
