<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";
import type { Tool } from "@/interfaces";
import Score from "./score.vue";
import Upload from "./upload.vue";

const cats = ref("全部工具");
const tool = ref<Tool>({
  id: "",
  name: "",
  category: "",
  description: "",
  score: 0,
  url: "",
  logo_url: "",
});

const selectToolStore = useSelectedToolStore();

const gotoSite = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

onMounted(() => {
  setTimeout(() => {
    try {
      const selectedTool = localStorage.getItem("selectedTool");
      if (selectedTool) {
        const parsedTool = JSON.parse(selectedTool);
        selectToolStore.selectedTool = parsedTool;
        tool.value = parsedTool;
      }
    } catch (error) {
      console.error("解析工具数据失败:", error);
    }
  }, 100);
});
</script>

<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">{{
        cats
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tool.category }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tool.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="main-info">
      <div class="info">
        <div class="header-section">
          <div class="name">{{ tool.name }}</div>
          <div class="score">
            <span class="txt">当前评分</span> {{ tool.score }} ⭐
          </div>
        </div>

        <div class="description">{{ tool.description }}</div>

        <div class="tag-section">
          <div class="tag-list">
            <span class="tag-item">{{ tool.category }}</span>
            <span class="tag-item">AI工具</span>
          </div>
        </div>

        <div class="action-section">
          <button class="url-button" @click="gotoSite(tool.url)">
            访问官网
          </button>
        </div>
      </div>

      <div class="logo-container">
        <img :src="tool.logo_url" :alt="tool.name" />
      </div>
    </div>

    <div class="score-section">
      <Score />
    </div>
    <div class="score-section">
      <Upload />
    </div>
  </div>
</template>

<style scoped lang="scss">
$border-radius: 16px;
$box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
$hover-box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
$transition-duration: 0.3s;
$primary-color: #409eff;
$gradient-start: #ff7a18;
$gradient-end: #af002d;

@mixin hover-effect {
  transition: all $transition-duration ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: $hover-box-shadow;
  }
}

@mixin card-style {
  background: var(--background-color);
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

.breadcrumb {
  margin-bottom: 25px;
  padding: 10px 0;
  font-size: 14px;

  :deep(.el-breadcrumb__inner),
  :deep(.el-breadcrumb__inner.is-link) {
    color: var(--text-color) !important;
    transition: color $transition-duration ease;
    font-weight: 500;
    &:hover {
      font-weight: bold;
      color: $primary-color !important;
    }
  }
  :deep(.el-breadcrumb__separator) {
    color: var(--text-color-secondary) !important;
  }
}

.main-info {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  align-items: stretch;

  .info {
    flex: 1;
    @include card-style;
    padding: 30px;

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .name {
        font-size: 48px;
        font-weight: bold;
        color: var(--text-color);
      }
    }

    .score {
      @include flex-center-left;
      font-size: 28px;
      font-weight: bold;
      color: #ff9800;

      .txt {
        font-size: 16px;
        font-weight: normal;
        color: var(--text-color-secondary);
        margin-right: 8px;
      }
    }

    .description {
      font-size: 18px;
      line-height: 1.6;
      color: var(--text-color-secondary);
      margin-bottom: 20px;
      max-width: 800px;
    }

    .tag-section {
      @include flex-center-left;
      margin-bottom: 20px;

      .tag-list {
        display: flex;
        gap: 10px;

        .tag-item {
          padding: 6px 14px;
          border-radius: 14px;
          font-size: 14px;
          background: rgba($primary-color, 0.1);
          color: $primary-color;
          transition: all $transition-duration ease;

          &:hover {
            background: rgba($primary-color, 0.2);
            transform: translateY(-1px);
          }
        }
      }
    }

    .action-section {
      @include flex-center-left;
      gap: 20px;

      .url-button {
        @include flex-center-left;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, $gradient-start, $gradient-end);
        color: white;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all $transition-duration ease;
        box-shadow: 0 4px 12px rgba($gradient-start, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba($gradient-start, 0.4);
        }

        .el-icon {
          font-size: 18px;
        }
      }
    }
  }

  .logo-container {
    flex: 0.7;
    padding: 25px;
    @include card-style;
    @include flex-center-left;
    justify-content: center;
    overflow: hidden;
    @include hover-effect;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.4s ease;

      &:hover {
        transform: scale(1.15);
      }
    }
  }
}

.score-section {
  margin-top: 40px;
  border-radius: $border-radius;
  overflow: hidden;
  @include card-style;
}
</style>
