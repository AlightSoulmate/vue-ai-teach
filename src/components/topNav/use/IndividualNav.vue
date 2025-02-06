<template>
  <div class="grid-content">
    <span class="login-container">我的</span>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
.grid-content {
  min-height: 55px;
  display: flex;
  text-align: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bolder;
  color: rgba(255, 255, 255, 0.825);
  margin-left: 90px;
  letter-spacing: 1px;
}

.login-container:hover {
  cursor: pointer;
  width: 70px;
  color: #ffffff;
  background-color: rgba(220, 108, 28, 0.884);
}
</style>
