<script lang="ts" setup>
import { ref } from "vue";
import {
  Menu as IconMenu,
  Location,
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
    if (authStore.user.role === "teacher") {
      return "/teacherCourse";
    }
    return "/home";
  })
);
const isCollapse = ref<boolean>(false);

const role = computed(() => ({
  isStudent: authStore.user.role === "student",
  isTeacher: authStore.user.role === "teacher",
  isAdmin: authStore.user.role === "admin",
}));

const paths = ref<Record<any, string>>({
  tools: "/home",
  admin: "/admin",
  toolList: "/toolList",
  stuList: "/stuList",
  teaList: "/teaList",
  teacherCourse: "/teacherCourse",
  teacherEvals: "/teacherEvals",
  studentCourse: "/studentCourse",
  studentEvals: "/studentEvals",
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
      <el-button class="collapse-btn" type="primary" @click="toggleCollapse" text>
        <el-icon class="collapse-icon" v-if="isCollapse" title="展开">
          <Expand />
        </el-icon>
        <el-icon class="collapse-icon" v-else title="折叠">
          <Fold />
        </el-icon>
      </el-button>
    </div>
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse" router>
      <template v-if="role.isStudent">
        <el-menu-item :index="paths.tools">
          <el-icon>
            <Location />
          </el-icon>
          工具集
        </el-menu-item>
      </template>

      <template v-if="role.isAdmin">
        <el-menu-item :index="paths.toolList">
          <el-icon>
            <IconMenu />
          </el-icon>
          <span>工具管理</span>
        </el-menu-item>
        <el-menu-item :index="paths.stuList">
          <el-icon>
            <IconMenu />
          </el-icon>
          <span>学生管理</span>
        </el-menu-item>
        <el-menu-item :index="paths.teaList">
          <el-icon>
            <IconMenu />
          </el-icon>
          <span>教师管理</span>
        </el-menu-item>
      </template>

      <el-menu-item :index="paths.teacherCourse" v-if="role.isTeacher">
        <el-icon>
          <IconMenu />
        </el-icon>
        <span>课程管理</span>
      </el-menu-item>
      <el-menu-item :index="paths.studentCourse" v-if="role.isStudent">
        <el-icon>
          <IconMenu />
        </el-icon>
        <span>评价记录</span>
      </el-menu-item>
      <el-menu-item :index="paths.studentEvals" v-if="role.isStudent">
        <el-icon>
          <Memo />
        </el-icon>
        <span>作业记录</span>
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
