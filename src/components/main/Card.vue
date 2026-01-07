<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(false);
const cardRef = ref<HTMLElement | null>(null);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.05,
    rootMargin: "100px",
  }
);

onMounted(() => {
  cardRef.value && observer.observe(cardRef.value);
});

onUnmounted(() => {
  observer.disconnect();
});
</script>

<template>
  <div class="card" ref="cardRef" :class="{ 'is-visible': isVisible }">
    <div class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div class="card-footer">
      <slot name="info" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: var(--card-background, rgba(255, 255, 255, 0.03));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
    transition-delay: min(calc(var(--index, 0) * 50ms), 200ms);
    visibility: visible;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  &:hover::before {
    opacity: 1;
  }

  .card-header {
    padding: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .card-body {
    flex: 1;
    padding: 0;
  }

  .card-footer {
    padding: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
}
</style>
