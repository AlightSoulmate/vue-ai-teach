<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ArrowRight, Link, ChatDotRound } from "@element-plus/icons-vue";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";
import Score from "./score.vue";
import Upload from "./upload.vue";

const cats = ref("全部工具");
const tool = ref<any>({});
const selectToolStore = useSelectedToolStore();

const gotoSite = (url: () => string) => {
  window.open(url(), "_blank", "noopener,noreferrer");
};

onMounted(() => {
  const selectedTool = localStorage.getItem("selectedTool");
  if (selectedTool) {
    selectToolStore.selectedTool = JSON.parse(selectedTool);
    tool.value = selectToolStore.selectedTool;
  }
  console.log(tool.value);
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
          <button class="url-button" @click="gotoSite(() => tool.url)">
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
    font-weight: 500;
    transition: color 0.3s ease;
    &:hover {
      font-weight: bold;
      color: #409eff !important;
    }
  }
  :deep(.el-breadcrumb__separator) {
    color: var(--text-color-secondary) !important;
  }
}

.main-info {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-bottom: 40px;
  align-items: stretch;

  .info {
    flex: 1;
    background: var(--background-color);
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

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
      display: flex;
      align-items: center;
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
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .tag-label {
        font-size: 16px;
        color: var(--text-color-secondary);
      }

      .tag-list {
        display: flex;
        gap: 10px;

        .tag-item {
          padding: 6px 14px;
          border-radius: 14px;
          font-size: 14px;
          background: rgba(64, 158, 255, 0.1);
          color: #409eff;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(64, 158, 255, 0.2);
            transform: translateY(-1px);
          }
        }
      }
    }
    .action-section {
      display: flex;
      align-items: center;
      gap: 20px;

      .url-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #ff7a18, #af002d);
        color: white;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(255, 122, 24, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 122, 24, 0.4);
        }
        .el-icon {
          font-size: 18px;
        }
      }
      .feedback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid var(--border-color);
        color: var(--text-color-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          border-color: #409eff;
          color: #409eff;
          transform: rotate(15deg);
        }
        .el-icon {
          font-size: 20px;
        }
      }
    }
  }
  .logo-container {
    flex: 0.7;
    padding: 25px;
    background: var(--background-color);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

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
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
