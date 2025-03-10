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
      @open="handleOpen"
      :collapse="isCollapse"
      router
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Location /></el-icon>
          <span>热门AI工具</span>
        </template>
        <el-menu-item :index="paths.tools">工具集</el-menu-item>
        <el-menu-item :index="paths.forum">论坛</el-menu-item>
      </el-sub-menu>
      <el-sub-menu :index="paths.admin" v-if="role.isAdmin">
        <template #title>
          <el-icon><Location /></el-icon>
          <span>管理中心</span>
        </template>
        <el-menu-item :index="paths.adminTool">工具管理</el-menu-item>
        <el-menu-item :index="paths.adminStudent">学生管理</el-menu-item>
        <el-menu-item :index="paths.adminTeacher">教师管理</el-menu-item>
      </el-sub-menu>
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
const activeMenu = ref("/home");

const role = computed(() => ({
  isStudent: authStore.user.role === "student",
  isTeacher: authStore.user.role === "teacher",
  isAdmin: authStore.user.role === "admin",
}));
const isCollapse = ref(false);
const paths = ref<Record<any, string>>({
  tools: "/home",
  forum: "/forum",
  adminTool: "/adminTool",
  adminStudent: "/adminStudent",
  adminTeacher: "/adminTeacher",
  teacherCrouse: "/teacherCourse",
  teacherInbox: "/teacherInbox",
  studentCrouse: "/studentCourse",
  studentInbox: "/studentInbox",
  setup: "/setup",
});

const handleOpen = (key: string) => {};

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  emit("collapse", isCollapse.value);
};

const emit = defineEmits(["collapse"]);
</script>
<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: fixed;
  background-color: var(--background-color);
  border-right: 1px solid var(--border-color);
}

.collapse-trigger {
  position: absolute;
  right: -40px;
  top: 8px;
  z-index: 2000;
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
  /* border-right: 1px solid var(--border-color); */
}

.el-menu {
  background-color: var(--background-color);
}

/* 菜单项样式 */
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

/* 子菜单样式 */
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

/* 图标颜色 */
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  color: var(--text-color);
}

/* 激活状态的图标颜色 */
:deep(.el-menu-item.is-active .el-icon) {
  color: var(--el-color-primary);
}

:deep(.el-aside) {
  overflow: visible !important;
}
</style>
