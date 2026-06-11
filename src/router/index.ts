import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  canAccessMeta,
  createRouteMeta,
  defaultRouteByRole,
  isAppRole,
} from "@/constants/permissions";

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
      meta: createRouteMeta({ title: "登录", public: true }),
      component: () => import("@/pages/loginPage.vue"),
    },
    {
      path: "/form",
      name: "Form",
      meta: createRouteMeta({ title: "登录表单", public: true }),
      component: () => import("@/pages/formPage.vue"),
    },
    {
      path: "/auth/student",
      name: "StudentLogin",
      meta: createRouteMeta({ title: "学生登录", public: true }),
      component: () => import("@/pages/auth/studentLogin.vue"),
    },
    {
      path: "/auth/teacher",
      name: "TeacherLogin",
      meta: createRouteMeta({ title: "教师登录", public: true }),
      component: () => import("@/pages/auth/teacherLogin.vue"),
    },
    {
      path: "/auth/admin",
      name: "AdminLogin",
      meta: createRouteMeta({ title: "管理员登录", public: true }),
      component: () => import("@/pages/auth/adminLogin.vue"),
    },
    {
      path: "/home",
      name: "MainLayout",
      meta: createRouteMeta({ title: "工作台", roles: ["admin", "teacher", "student"] }),
      component: () => import("@/pages/mainPage.vue"),
      children: [
        {
          path: "",
          name: "Home",
          meta: createRouteMeta({
            title: "AI 工具集",
            roles: ["admin", "teacher", "student"],
            permissions: ["tool:read"],
            menu: true,
          }),
          component: () => import("@/components/main/index.vue"),
        },
        {
          path: "/home/studentCourse",
          name: "StudentCourse",
          meta: createRouteMeta({
            title: "评价记录",
            roles: ["student"],
            permissions: ["course:read"],
            menu: true,
          }),
          component: () => import("@/pages/student/course.vue"),
        },
        {
          path: "/home/studentEvals",
          name: "StudentEvals",
          meta: createRouteMeta({
            title: "作业记录",
            roles: ["student"],
            permissions: ["assignment:read"],
            menu: true,
          }),
          component: () => import("@/pages/student/evals.vue"),
        },
        {
          path: "/home/studentInbox",
          name: "StudentInbox",
          meta: createRouteMeta({
            title: "收件箱",
            roles: ["student"],
            permissions: ["inbox:read"],
            menu: true,
          }),
          component: () => import("@/pages/student/inbox.vue"),
        },
        {
          path: "/home/teacherCourse",
          name: "TeacherCourse",
          meta: createRouteMeta({
            title: "课程管理",
            roles: ["teacher"],
            permissions: ["course:manage"],
            menu: true,
          }),
          component: () => import("@/pages/teacher/course.vue"),
        },
        {
          path: "/home/teacherEvals",
          name: "TeacherEvals",
          meta: createRouteMeta({
            title: "课程评价",
            roles: ["teacher"],
            permissions: ["course:read"],
          }),
          component: () => import("@/pages/teacher/evals.vue"),
        },
        {
          path: "/home/teacherAssignments",
          name: "TeacherAssignments",
          meta: createRouteMeta({
            title: "作业管理",
            roles: ["teacher"],
            permissions: ["assignment:publish", "assignment:grade"],
            menu: true,
          }),
          component: () => import("@/pages/teacher/assignments.vue"),
        },
        {
          path: "/home/teacherGrading",
          name: "TeacherTeaching",
          meta: createRouteMeta({
            title: "AI 批改中心",
            roles: ["teacher"],
            permissions: ["assignment:grade"],
            menu: true,
          }),
          component: () => import("@/pages/teacher/agent.vue"),
        },
        {
          path: "/home/stuList",
          name: "StuList",
          meta: createRouteMeta({
            title: "学生管理",
            roles: ["admin"],
            permissions: ["student:manage"],
            menu: true,
          }),
          component: () => import("@/pages/admin/stuList.vue"),
        },
        {
          path: "/home/teaList",
          name: "TeaList",
          meta: createRouteMeta({
            title: "教师管理",
            roles: ["admin"],
            permissions: ["teacher:manage"],
            menu: true,
          }),
          component: () => import("@/pages/admin/teaList.vue"),
        },
        {
          path: "/home/toolList",
          name: "ToolList",
          meta: createRouteMeta({
            title: "工具管理",
            roles: ["admin"],
            permissions: ["tool:manage"],
            menu: true,
          }),
          component: () => import("@/pages/admin/toolList.vue"),
        },
      ],
    },
    {
      path: "/detail",
      name: "Detail",
      meta: createRouteMeta({
        title: "工具详情",
        roles: ["admin", "teacher", "student"],
        permissions: ["tool:read"],
      }),
      component: () => import("@/pages/tool/detailPage.vue"),
    },
    {
      path: "/result",
      name: "EvalResult",
      meta: createRouteMeta({
        title: "评测结果",
        roles: ["teacher", "student"],
        permissions: ["tool:read"],
      }),
      component: () => import("@/pages/tool/evalResultPage.vue"),
    },
    {
      path: "/persona",
      name: "Persona",
      meta: createRouteMeta({
        title: "角色画像",
        roles: ["teacher", "student"],
        permissions: ["course:read"],
      }),
      component: () => import("@/components/course/persona.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/home",
      meta: createRouteMeta({ title: "重定向", public: true }),
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  authStore.checkAuth();

  const role = authStore.currentRole || authStore.user.role;
  const homePath = isAppRole(role) ? defaultRouteByRole[role] : "/login";

  if (!authStore.isAuthenticated && !to.meta.public) {
    return { name: "Login" };
  }

  if (authStore.isAuthenticated && to.meta.public) {
    return homePath;
  }

  if (!canAccessMeta(role, to.meta)) {
    return homePath;
  }

  return true;
});

export default router;
