<template>
  <div class="auth-buttons">
        <el-button type="primary" @click="handleLogin" text>登录</el-button>
        <el-button type="primary" @click="handleRegister">注册</el-button>
      </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
const handleLogin = () => {
  ElMessage({
    message: "从下面的登录框登入",
    type: "info",
  });
};

const handleRegister = () => {
  ElMessage({
    message: "从下面的注册框登入",
    type: "info",
  });
};
</script>
<style scoped>
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

:deep(.el-button) {
  font-weight: 500;
}

:deep(.el-button--text) {
  font-size: 14px;
}

:deep(.el-button--primary:not(.el-button--text)) {
  border-radius: 20px;
  padding: 8px 24px;
}
</style>
