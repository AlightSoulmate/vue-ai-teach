<template>
  <div class="grid-content">
    <span class="login-container" @click="fakeLogin">登录</span>
    <span class="register-container" @click="fakeRegister">注册</span>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';

const fakeLogin = () => {
  ElMessage({
    message: '请点击开始使用以登入',
    type: 'warning',
  })
};
const fakeRegister = () => {
  ElMessage({
    message: '请点击开始使用以新建账号.',
    type: 'warning',
  })
};
</script>
<style scoped>
.grid-content {
  min-height: 55px;
  display: flex;
  text-align: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bolder;
  color: rgba(255, 255, 255, 0.579);
  letter-spacing: 2px;
}
.grid-content span {
  cursor: pointer;
  width: 80px;
}
.login-container:hover {
  color: #ffffff;
}
.register-container:hover {
  color: #ffffff;
}
</style>
