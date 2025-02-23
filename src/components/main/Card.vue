<template>
  <div class="card">
    <!-- 顶部插槽 -->
    <div class="card-header">
      <slot name="header">
        <img src="#" alt="默认图片" />
      </slot>
    </div>
    <!-- 中间插槽 -->
    <div class="card-body">
      <slot>
        <p>未知工具</p>
      </slot>
    </div>
    <!-- 底部插槽 -->
    <div class="card-footer">
      <div class="start">
        <slot name="footer-left">未知评分</slot>
      </div>
      <div class="go">
        <slot name="footer-right">无内容</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.card {
  width: 156px;
  height: 143px;
  margin: 10px;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  background-color: var(--background-color);
  display: flex;
  color: var(--text-color);
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.card-header {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.card-header img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 保证图片在容器内完整显示，且不被拉伸 */
  border-radius: 5px;
}

.card-body {
  flex: 1;
  height: 40px;
  padding: 0 0 8px 10px;
  font-weight: bold;
  text-align: left;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  text-overflow: ellipsis;
}

.card-footer {
  display: flex;
  width: 100%;
  height: 30px;
  border-top: 1px solid #2d2d2d;
  box-sizing: border-box;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  text-align: center;
  font-size: 13px;
}

.start,
.go {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
}

.start {
  border-right: 1px solid #2d2d2d;
  cursor: pointer;
}
</style>
