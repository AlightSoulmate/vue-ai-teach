<script lang="ts" setup>
import { ref } from "vue";
import {
  Menu as IconMenu,
  Location,
  Setting,
  Memo,
  Expand,
  Fold,
} from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { computed } from "vue";

const authStore = useAuthStore();
const activeMenu = ref(
  computed(() => {
    if (authStore.user.role === "admin") {
      return "/admin";
    }
    return "/home";
  })
);
const isCollapse = ref<boolean>(true);

const role = computed(() => ({
  isStudent: authStore.user.role === "student",
  isTeacher: authStore.user.role === "teacher",
  isAdmin: authStore.user.role === "admin",
}));

const paths = ref<Record<any, string>>({
  tools: "/home",
  history: "/history",
  forum: "/forum",
  admin: "/admin",
  toolList: "/toolList",
  stuList: "/stuList",
  teaList: "/teaList",
  teacherCrouse: "/teacherCourse",
  teacherInbox: "/teacherInbox",
  studentCrouse: "/studentCourse",
  studentInbox: "/studentInbox",
  setup: "/setup",
});

const toggleCollapse = (): void => {
  isCollapse.value = !isCollapse.value;
  emit("collapse", isCollapse.value);
};

const emit = defineEmits(["collapse"]);
</script>

<template>
  <div class="menu-container">
    <div class="collapse-trigger">
      <el-button
        class="collapse-btn"
        type="primary"
        @click="toggleCollapse"
        text
      >
        <el-icon class="collapse-icon" v-if="isCollapse" title="展开">
          <Expand />
        </el-icon>
        <el-icon class="collapse-icon" v-else title="折叠">
          <Fold />
        </el-icon>
      </el-button>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      router
    >
      <template v-if="!role.isAdmin">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Location /></el-icon>
            <span>热门AI工具</span>
          </template>
          <el-menu-item :index="paths.tools">工具集</el-menu-item>
          <el-menu-item :index="paths.history">历史评价记录</el-menu-item>
          <el-menu-item :index="paths.forum">论坛</el-menu-item>
        </el-sub-menu>
      </template>

      <template v-if="role.isAdmin">
        <el-menu-item :index="paths.toolList">
          <el-icon><IconMenu /></el-icon>
          <span>工具管理</span>
        </el-menu-item>
        <el-menu-item :index="paths.stuList">
          <el-icon><IconMenu /></el-icon>
          <span>学生管理</span>
        </el-menu-item>
        <el-menu-item :index="paths.teaList">
          <el-icon><IconMenu /></el-icon>
          <span>教师管理</span>
        </el-menu-item>
      </template>

      <el-menu-item :index="paths.teacherCrouse" v-if="role.isTeacher">
        <el-icon><IconMenu /></el-icon>
        <span>我的课程（老师）</span>
      </el-menu-item>
      <el-menu-item :index="paths.teacherInbox" v-if="role.isTeacher">
        <el-icon><Memo /></el-icon>
        <span>收件箱（老师）</span>
      </el-menu-item>
      <el-menu-item :index="paths.studentCrouse" v-if="role.isStudent">
        <el-icon><IconMenu /></el-icon>
        <span>我的课程（学生）</span>
      </el-menu-item>
      <el-menu-item :index="paths.studentInbox" v-if="role.isStudent">
        <el-icon><Memo /></el-icon>
        <span>收件箱（学生）</span>
      </el-menu-item>
      <el-menu-item :index="paths.setup">
        <el-icon><Setting /></el-icon>
        <span>个性化设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: fixed;
  background-color: var(--background-color);
  border-right: 1px solid var(--border-color);
  z-index: 100;
}

.collapse-trigger {
  position: absolute;
  right: -40px;
  top: 8px;
  z-index: 100;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
  background-color: transparent;
  z-index: 100;
}

.collapse-btn:hover {
  background-color: var(--collapse-hover-color) !important;
  color: var(--active-text-color) !important;
}

.collapse-icon {
  font-size: 27px !important;
}

.el-icon {
  font-size: 20px;
  vertical-align: middle;
  color: var(--text-color);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  background-color: var(--background-color);
}

.el-menu {
  background-color: var(--background-color);
}

:deep(.el-menu-item) {
  color: var(--text-color) !important;
  background-color: var(--background-color);
}

:deep(.el-menu-item:hover) {
  background-color: var(--hover-color);
}

:deep(.el-menu-item.is-active) {
  color: var(--el-color-primary) !important;
  background-color: var(--active-background-color);
}

:deep(.el-sub-menu__title) {
  color: var(--text-color) !important;
  background-color: var(--background-color);
}

:deep(.el-sub-menu__title:hover) {
  background-color: var(--hover-color) !important;
}

:deep(.el-menu--collapse) {
  background-color: var(--background-color);
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  color: var(--text-color);
}

:deep(.el-menu-item.is-active .el-icon) {
  color: var(--el-color-primary);
}

:deep(.el-aside) {
  overflow: visible !important;
}
</style>
