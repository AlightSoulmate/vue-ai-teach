<template>
  <div class="back-top-container" v-show="isVisible">
    <button @click="scrollToTop">
      <div class="text">
        <span>Back</span>
        <span>to</span>
        <span>top</span>
      </div>
      <div class="clone">
        <span>Back</span>
        <span>to</span>
        <span>top</span>
      </div>
      <svg
        stroke-width="2"
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        class="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
      >
        <path
          d="M14 5l7 7m0 0l-7 7m7-7H3"
          stroke-linejoin="round"
          stroke-linecap="round"
        ></path>  
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(false);

const checkScroll = () => {
  // 当滚动超过90vh时显示按钮
  isVisible.value = window.scrollY > window.innerHeight * 0.9;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", checkScroll);
  checkScroll(); // 初始检查
});

onUnmounted(() => {
  window.removeEventListener("scroll", checkScroll);
});
</script>

<style scoped>
.back-top-container {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 1001;
  transition: opacity 0.3s;
  transform: scale(0.8);
}

button {
  width: 140px;
  height: 56px;
  overflow: hidden;
  border: none;
  color: var(--text-color);
  background: none;
  position: relative;
  padding-bottom: 2em;
  cursor: pointer;
}

button > div,
button > svg {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
}

button:before {
  content: "";
  position: absolute;
  height: 2px;
  bottom: 0;
  left: 0;
  width: 100%;
  transform: scaleX(0);
  transform-origin: bottom right;
  background: currentColor;
  transition: transform 0.25s ease-out;
}

button:hover:before {
  transform: scaleX(1);
  transform-origin: bottom left;
}

button .clone > *,
button .text > * {
  opacity: 1;
  font-size: 1.3rem;
  transition: 0.2s;
  margin-left: 4px;
}

button .clone > * {
  transform: translateY(60px);
}

button:hover .clone > * {
  opacity: 1;
  transform: translateY(0px);
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
}

button:hover .text > * {
  opacity: 1;
  transform: translateY(-60px);
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
}

button:hover .clone > :nth-child(1) {
  transition-delay: 0.15s;
}

button:hover .clone > :nth-child(2) {
  transition-delay: 0.2s;
}

button:hover .clone > :nth-child(3) {
  transition-delay: 0.25s;
}

button:hover .clone > :nth-child(4) {
  transition-delay: 0.3s;
}
/* icon style and hover */
button svg {
  width: 20px;
  right: 0;
  top: 50%;
  transform: translateY(-50%) rotate(-50deg);
  transition: 0.2s ease-out;
}

button:hover svg {
  transform: translateY(-50%) rotate(-90deg);
}
</style>
