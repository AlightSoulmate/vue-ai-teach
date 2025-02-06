<template>
  <div class="grid-content">
    <span class="login-container" @click="loginIn">登录</span>
    <span class="register-container">注册</span>
  </div>
</template>
<script lang="ts" setup>
const loginIn = () => {
  console.log("loginIn");
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
  margin-left: 90px;
  letter-spacing: 2px;
}
.grid-content span {
  cursor: pointer;
  width: 80px;
}
.login-container:hover {
  color: #ffffff;
  background-color: rgba(210, 105, 30, 0.836);
}
.register-container:hover {
  color: #ffffff;
  background-color: darkcyan;
}
</style>
