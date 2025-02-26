<template>
  <el-dropdown class="user-dropdown">
    <div class="user-info">
      <el-avatar :size="32" :src="userAvatar">
        {{ authStore.user.username?.charAt(0) }}
      </el-avatar>
      <span class="username">{{ authStore.user.username }}</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-icon><User /></el-icon>ID: {{ authStore.user.id }}
        </el-dropdown-item>
        <el-dropdown-item>
          <el-icon><UserFilled /></el-icon>
          身份: {{ authStore.user.role }}
        </el-dropdown-item>
        <el-dropdown-item @click="handleModifyPassword">
          <el-icon><Key /></el-icon>修改密码
        </el-dropdown-item>
        <el-dropdown-item @click="handleLogout" divided>
          <el-icon><Logout /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import { onMounted } from "vue";
import {
  User,
  UserFilled,
  Key,
  SwitchButton as Logout,
} from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const userAvatar = "";

const handleLogout = () => {
  ElMessageBox.confirm("你确定退出登录吗？下次登录需重新输入用户名密码")
    .then(() => {
      authStore.logout();
      console.log("退出登录");
    })
    .catch((e) => {
      console.error(e);
    });
};
// 修改密码
const handleModifyPassword = () => {
  authStore.changePassword();
};

onMounted(() => {
  const userInfo = localStorage.getItem("user");
  authStore.user = userInfo
    ? JSON.parse(userInfo)
    : {
        id: 0,
        username: "未登录",
        role: "未登录",
        token: "未登录",
      };
  console.log(authStore.user);
});
</script>

<style scoped>
.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: var(--el-fill-color-light);
}

.username {
  font-size: 14px;
  color: var(--text-color);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
