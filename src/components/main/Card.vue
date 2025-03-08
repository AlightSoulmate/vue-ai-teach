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
          <span>unknown rating</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.card {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
}

.card-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

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
    color: var(--text-color);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.card-info {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.card-footer {
  display: flex;
  height: 40px;
  border-top: 1px solid #f0f0f0;
}

.start,
.go {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.start {
  border-right: 1px solid #f0f0f0;
  color: #ff9800;
  font-weight: 500;
}

.go {
  color: #409eff;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(64, 158, 255, 0.1);
  }
}
</style>
