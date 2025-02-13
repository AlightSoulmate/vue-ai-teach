<template>
  <div class="help-content" @click="fakeHelp">使用说明</div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';

const fakeHelp = () => {
  ElMessage({
    message: '模块尚未开发',
    type: 'warning',
  })
};
</script>
<style scope>
.help-content {
  min-height: 55px;
  color: rgba(240, 248, 255, 0.685);
  font-size: 16px;
}
.help-content:hover {
  cursor: pointer;
  color: #ffffff;
}
</style>
