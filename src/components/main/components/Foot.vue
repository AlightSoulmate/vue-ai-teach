<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <div class="footer-logo-icon">
          <el-icon :size="24" color="var(--el-color-primary)"
            ><Monitor
          /></el-icon>
        </div>
        <div class="footer-logo-text">AI工具集</div>
      </div>
      <div class="footer-links">
        <a href="#" class="footer-link">关于我们</a>
        <a href="#" class="footer-link">联系方式</a>
        <a href="#" class="footer-link">隐私政策</a>
        <a href="#" class="footer-link">使用条款</a>
      </div>
      <div class="footer-copyright">© 2025 AITEACH. 保留所有权利</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Monitor } from "@element-plus/icons-vue";
</script>
<style lang="scss" scoped>
@use "../index.scss" as *;
</style>
