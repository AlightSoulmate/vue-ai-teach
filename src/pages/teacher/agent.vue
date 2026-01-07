<template>
  <div class="grading-page">
    <iframe
      src="http://121.40.171.211:3000/"
      frameborder="0"
      class="grading-iframe"
      title="智能教学系统"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
// 智能教学页面 - 通过iframe嵌入外部部署的智能教学系统
</script>

<style scoped lang="scss">
.grading-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.grading-iframe {
  width: 100%;
  height: calc(100vh - 60px); // 减去顶部导航栏高度
  border: none;
  display: block;
}
</style>

