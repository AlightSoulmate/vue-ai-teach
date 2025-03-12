<template>
  <div class="card">
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

<script lang="ts" setup></script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background-color: var(--card-background);
  display: flex;
  flex-direction: column;
  box-shadow: 1px 3px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

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
    transform: translateY(-1px);
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
    transition: all 0.25s ease-out;
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
  }

  .go-arrow {
    margin-top: -4px;
    margin-right: -4px;
    color: white;
    font-family: courier, sans;
  }
}
</style>
