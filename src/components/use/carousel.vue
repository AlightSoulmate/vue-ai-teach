<!-- CSS 无边界走马灯 github.com/AlightSoulmate -->

<style scoped>
.card {
  width: 100%;
  height: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: white;
  text-align: center;
}

.card p {
  font-size: 14px;
  color: white;
}

.card img {
  transform: scale(0.6);
  margin-top: -40px;
}

.slider-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.slider {
  width: 100%;
  height: var(--height);
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
}
.slider .list {
  display: flex;
  width: 100%;
  min-width: calc(var(--width) * var(--quantity));
  position: relative;
}
.slider .list .item {
  width: var(--width);
  height: var(--height);
  position: absolute;
  left: 100%;
  animation: autoRun 30s linear infinite;
  transition: transform 0.3s;
  animation-delay: calc(
    (30s / var(--quantity)) * (var(--position) - 1) - 30s
  ) !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.slider .list .item img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  transition: transform 0.3s;
}
@keyframes autoRun {
  from {
    left: 100%;
  }
  to {
    left: calc(var(--width) * -1);
  }
}
.slider:hover .item {
  animation-play-state: paused !important;
}
.slider .item:hover img {
  transform: scale(1.2);
}
.slider[reverse="true"] .list .item {
  animation: reversePlay 30s linear infinite;
  animation-delay: calc(
    (30s / var(--quantity)) * (var(--position) - 1) - 30s
  ) !important;
}
@keyframes reversePlay {
  from {
    left: calc(var(--width) * -1);
  }
  to {
    left: 100%;
  }
}
</style>
<script lang="ts" setup>
import { useLoginToolsStore } from "@/stores/useLoginToolsStore";
import { onMounted, computed } from "vue";

const loginToolsStore = useLoginToolsStore();

// 获取所有工具
const allTools = computed(() => {
  const tools = Object.values(loginToolsStore.toolsByCategory || {}).flat();
  return tools;
});

// 工具数组
const firstRowTools = computed(() => {
  if (!allTools.value.length) return [];
  return [...allTools.value].sort(() => 0.5 - Math.random()).slice(0, 20);
});

const secondRowTools = computed(() => {
  if (!allTools.value.length) return [];
  return [...allTools.value].sort(() => 0.5 - Math.random()).slice(0, 20);
});

const thirdRowTools = computed(() => {
  if (!allTools.value.length) return [];
  return [...allTools.value].sort(() => 0.5 - Math.random()).slice(0, 20);
});

onMounted(() => {
  loginToolsStore.fetchCategory();
});
</script>
<template>
  <div class="slider-container">
    <!-- 第一行 -->
    <div class="slider" style="--width: 100px; --height: 80px; --quantity: 20">
      <div class="list">
        <div
          class="item"
          v-for="(tool, index) in firstRowTools"
          :key="`row1-${tool.id}`"
          :style="`--position:${index + 1}`"
        >
          <img :src="tool.logo_url" :alt="tool.name" :title="tool.name" />
        </div>
      </div>
    </div>

    <!-- 第二行 -->
    <div
      class="slider"
      reverse="true"
      style="--width: 100px; --height: 80px; --quantity: 20"
    >
      <div class="list">
        <div
          class="item"
          v-for="(tool, index) in secondRowTools"
          :key="`row2-${tool.id}`"
          :style="`--position:${index + 1}`"
        >
          <img :src="tool.logo_url" :alt="tool.name" :title="tool.name" />
        </div>
      </div>
    </div>

    <!-- 第三行 -->
    <div class="slider" style="--width: 100px; --height: 80px; --quantity: 20">
      <div class="list">
        <div
          class="item"
          v-for="(tool, index) in thirdRowTools"
          :key="`row3-${tool.id}`"
          :style="`--position:${index + 1}`"
        >
          <img :src="tool.logo_url" :alt="tool.name" :title="tool.name" />
        </div>
      </div>
    </div>
  </div>
</template>
