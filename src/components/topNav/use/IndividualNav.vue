<template>
  <el-dropdown class="grid-content">
    <span class="el-dropdown-link">
      个人中心
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>id: {{ authStore.user.id }}</el-dropdown-item>
        <el-dropdown-item>昵称: {{ authStore.user.username }}</el-dropdown-item>
        <el-dropdown-item
          >身份: {{
            authStore.user.role == "user" ? "学生" : "管理员"
          }}</el-dropdown-item
        >
        <el-dropdown-item>修改密码</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { ArrowDown } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/useAuthStore";
const authStore = useAuthStore();
</script>
<style scoped>
.grid-content {
  min-height: 55px;
  display: flex;
  text-align: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bolder;
  color: var(--text-color);
  margin-left: 90px;
  letter-spacing: 1px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.el-dropdown-link[data-theme="light"]:hover {
  color: #ccc;
}
.el-dropdown-link[data-theme="dark"]:hover {
  color: red;
}
</style>
