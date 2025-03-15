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
  if (cardRef.value) {
    observer.observe(cardRef.value);
  }
});

onUnmounted(() => {
  observer.disconnect();
});
</script>

<template>
  <div class="card" ref="cardRef" :class="{ 'is-visible': isVisible }">
    <div class="card-content">
      <div class="card-header">
        <slot name="header">
          <img src="#" alt="Default picture" />
        </slot>
      </div>
      <div class="card-body">
        <slot>
          <p>unknown tool</p>
        </slot>
      </div>
      <div class="card-info">
        <slot name="info">
          <div>unknown rating</div>
        </slot>
      </div>
    </div>
    <div class="go-corner" href="#">
      <div class="go-arrow">→</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background-color: var(--card-background);
  display: flex;
  flex-direction: column;
  box-shadow: 1px 3px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  visibility: hidden;

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
    z-index: -1;
    top: -16px;
    right: -16px;
    background: #00838d;
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.25s ease-out;
  }

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    color: #ffffff;
  }

  &:hover::before {
    transform: scale(21);
  }

  .card-content {
    flex: 1;
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;

    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 2px;

      img {
        width: 48px;
        height: 48px;
        object-fit: contain;
        border-radius: 8px;
        background-color: #f9f9f9;
        padding: 4px;
      }
    }

    .card-body {
      flex: 1;

      p {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .card-info {
      font-size: 11px;
    }
  }

  ::v-deep(.card-content:hover) {
    color: rgba(255, 255, 255, 0.9);
  }

  .go-corner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 25px;
    height: 25px;
    overflow: hidden;
    top: 0;
    right: 0;
    background-color: #00838d;
    border-radius: 0 4px 0 32px;
    z-index: 2;
  }

  .go-arrow {
    margin-top: -4px;
    margin-right: -4px;
    color: white;
    font-family: courier, sans;
  }
}
</style>
