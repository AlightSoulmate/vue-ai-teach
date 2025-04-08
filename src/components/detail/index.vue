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
          <div class="score-badge">
            <span class="score-value">{{ tool.score }}</span>
            <span class="score-stars">⭐</span>
          </div>
        </div>

        <div class="description">{{ tool.description }}</div>

        <div class="tag-section">
          <div class="tag-list">
            <span class="tag-item primary">{{ tool.category }}</span>
            <span class="tag-item secondary">AI工具</span>
          </div>
        </div>

        <div class="action-section">
          <button class="url-button" @click="gotoSite(tool.url)">
            <span class="button-text">访问官网</span>
            <span class="button-icon">→</span>
          </button>
        </div>
      </div>

      <div class="logo-container">
        <div class="logo-wrapper">
          <img :src="tool.logo_url" :alt="tool.name" />
        </div>
      </div>
    </div>

    <div class="content-sections">
      <div class="score-section">
        <Score />
      </div>
      <div class="upload-section">
        <Upload />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$border-radius: 16px;
$border-radius-sm: 12px;
$transition-duration: 0.3s;
$primary-color: #409eff;
$gradient-start: #3498db;
$gradient-end: #2c3e50;
$box-shadow: 0 10px 30px rgba($gradient-start, 0.08);
$box-shadow-hover: 0 15px 35px rgba($gradient-start, 0.15);

@mixin hover-effect {
  transition: all $transition-duration ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: $box-shadow-hover;
  }
}

@mixin card-style {
  background: var(--background-color);
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  transition: all $transition-duration ease;

  &:hover {
    box-shadow: $box-shadow-hover;
  }
}

@mixin flex-center-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
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
  position: relative;

  &::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba($gradient-start, 0.03),
      rgba($gradient-end, 0.03)
    );
    z-index: -1;
  }
}

.breadcrumb {
  margin-bottom: 30px;
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
    padding: 40px;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, $gradient-start, $gradient-end);
      box-shadow: 0 0 10px rgba($gradient-start, 0.3);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      .name {
        font-size: 48px;
        font-weight: 800;
        color: var(--text-color);
        background: linear-gradient(135deg, $gradient-start, $gradient-end);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.2;
      }
    }

    .score-badge {
      display: flex;
      align-items: center;
      background: linear-gradient(
        135deg,
        rgba($gradient-start, 0.1),
        rgba($gradient-end, 0.1)
      );
      padding: 12px 16px;
      border-radius: 50px;

      .score-value {
        font-size: 28px;
        font-weight: bold;
        color: $gradient-start;
        margin-right: 5px;
      }

      .score-stars {
        font-size: 20px;
      }
    }

    .description {
      font-size: 18px;
      line-height: 1.8;
      color: var(--text-color-secondary);
      margin-bottom: 30px;
      max-width: 800px;
      position: relative;
      padding-left: 15px;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(to bottom, $gradient-start, $gradient-end);
        border-radius: 4px;
        box-shadow: 0 0 8px rgba($gradient-start, 0.2);
      }
    }

    .tag-section {
      @include flex-center-left;
      margin-bottom: 30px;

      .tag-list {
        display: flex;
        gap: 12px;

        .tag-item {
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          transition: all $transition-duration ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

          &.primary {
            background: rgba($primary-color, 0.1);
            color: $primary-color;
            border: 1px solid rgba($primary-color, 0.2);

            &:hover {
              background: rgba($primary-color, 0.2);
              transform: translateY(-2px);
            }
          }

          &.secondary {
            background: linear-gradient(
              135deg,
              rgba($gradient-start, 0.1),
              rgba($gradient-end, 0.1)
            );
            color: $gradient-start;
            border: 1px solid rgba($gradient-start, 0.2);

            &:hover {
              background: linear-gradient(
                135deg,
                rgba($gradient-start, 0.2),
                rgba($gradient-end, 0.2)
              );
              transform: translateY(-2px);
            }
          }
        }
      }
    }

    .action-section {
      @include flex-center-left;
      margin-top: 40px;

      .url-button {
        @include flex-center;
        gap: 12px;
        padding: 14px 28px;
        border: none;
        border-radius: $border-radius-sm;
        background: linear-gradient(135deg, $gradient-start, $gradient-end);
        color: white;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all $transition-duration ease;
        box-shadow: 0 8px 16px rgba($gradient-start, 0.3);
        position: relative;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transition: all 0.8s ease;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px rgba($gradient-start, 0.5);
          background: linear-gradient(135deg, #4aafff, $gradient-end);

          &::before {
            left: 100%;
          }
        }

        .button-text {
          position: relative;
          z-index: 2;
        }

        .button-icon {
          position: relative;
          z-index: 2;
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        &:hover .button-icon {
          transform: translateX(5px);
        }
      }
    }
  }

  .logo-container {
    flex: 0.7;
    @include card-style;
    @include hover-effect;
    padding: 0;
    position: relative;
    overflow: hidden;

    .logo-wrapper {
      height: 100%;
      width: 100%;
      @include flex-center;
      padding: 40px;
      background: linear-gradient(
        135deg,
        rgba($gradient-start, 0.05),
        rgba($gradient-end, 0.05)
      );

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.5s ease;
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));

        &:hover {
          transform: scale(1.1) rotate(2deg);
        }
      }
    }
  }
}

.content-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

.score-section,
.upload-section {
  border-radius: $border-radius;
  overflow: hidden;
  @include card-style;
  transition: all $transition-duration ease;
  background: var(--background-color);
  border: 1px solid rgba($gradient-start, 0.05);

  &:hover {
    transform: translateY(-5px);
  }
}

// 响应式设计
@media (max-width: 992px) {
  .main-info {
    flex-direction: column;

    .info {
      .header-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;

        .name {
          font-size: 36px;
        }
      }
    }

    .logo-container {
      height: 300px;
    }
  }
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .main-info {
    .info {
      padding: 30px;

      .header-section {
        .name {
          font-size: 32px;
        }
      }

      .description {
        font-size: 16px;
      }
    }
  }
}
</style>
