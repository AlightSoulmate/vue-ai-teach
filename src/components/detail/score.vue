<template>
  <div class="main-container">
    <div class="main-score-container">
      <div class="title">
        <el-icon><Checked /></el-icon>评分模块
      </div>
      <div class="content">
        <div class="rating-container">
          <el-popover
            v-for="(dimension, index) in scoreStore.ratingDimensions"
            :key="index"
            placement="right"
            :width="400"
            trigger="hover"
          >
            <template #reference>
              <div class="rating-item">
                <span class="rating-title">{{ dimension.name }}：</span>
                <el-rate
                  v-model="dimension.score"
                  :max="5"
                  allow-half
                  :colors="['#C6D1DE', '#409EFF', '#67C23A']"
                />
                <span class="score-label">{{ dimension.score }} 分</span>
              </div>
            </template>
            <template #default class="above-criteria-list">
              <div class="criteria-header">评分标准</div>
              <ul class="criteria-list">
                <li v-for="(criteria, idx) in dimension.criteria" :key="idx">
                  {{ criteria }}
                </li>
              </ul>
            </template>
          </el-popover>
        </div>
        <div class="comment">
          <span class="comment-title">可以在此处留下您的宝贵评价：</span>
          <el-input
            type="textarea"
            placeholder="在此处输入您的评价，帮助其他用户了解这个工具..."
            class="comment-input"
            :autosize="{ minRows: 3, maxRows: 6 }"
            v-model="scoreStore.ratingEvaluation.comment"
            :disabled="!canSubmit"
          />
        </div>
        <div class="submit-wrapper">
          <el-button
            type="primary"
            @click="submitRating"
            class="submit-btn"
            :disabled="!canSubmit"
            :loading="debounceStore.isSubmitting"
          >
            {{ submitButtonText }}
          </el-button>
          <div v-if="lastSubmitDate" class="submit-info">
            上次提交日期: {{ lastSubmitDate }}
          </div>
        </div>
      </div>
    </div>
    <div class="main-upload-container">
      <div class="score-title title">
        <el-icon><ChatDotRound /></el-icon>用户评价
      </div>
      <div class="tool-details">
        <div
          class="score-content"
          v-for="score in scoreStore.toolsDetail.rates"
          :key="score.id"
        >
          <div class="score-content-item">
            <div class="score-header">
              <div class="score-content-item-title">
                <el-avatar :size="28" class="user-avatar">{{
                  score.user.charAt(0)
                }}</el-avatar>
                {{ score.user }}
              </div>
              <div class="score-content-item-score">
                <span>评分：</span>{{ score.rating }} ⭐
              </div>
            </div>
            <div class="score-content-item-content">
              {{ score.comment }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Checked, ChatDotRound } from "@element-plus/icons-vue";
import { useScoreStore } from "@/stores/useScoreStore";
import { useDebounceStore } from "@/stores/useDebounceStore";

const scoreStore = useScoreStore();
const debounceStore = useDebounceStore();
const selectedToolId = ref<any>({});
const lastSubmitDate = ref("");

// 计算是否可以提交
const canSubmit = computed(() => {
  if (!selectedToolId.value?.id) return false;
  return (
    !debounceStore.dailySubmitManager.checkDailySubmit(
      selectedToolId.value.id
    ) && !debounceStore.isSubmitting
  );
});

// 提交按钮文本
const submitButtonText = computed(() => {
  if (debounceStore.isSubmitting) return "提交中...";
  if (
    selectedToolId.value?.id &&
    debounceStore.dailySubmitManager.checkDailySubmit(selectedToolId.value.id)
  ) {
    return "今日已提交";
  }
  return "提交评分";
});

// 处理提交评分
const handleSubmitRating = async () => {
  if (!canSubmit.value) {
    ElMessage({
      message: "您今天已经提交过评分，请明天再来！",
      type: "warning",
    });
    return;
  }

  await debounceStore.withSubmitLock(async () => {
    selectedToolId.value = JSON.parse(
      localStorage.getItem("selectedTool") as any
    );
    await scoreStore.evaluationTransmission(selectedToolId.value.id);

    // 记录提交时间
    debounceStore.dailySubmitManager.recordSubmit(selectedToolId.value.id);
    lastSubmitDate.value = debounceStore.dailySubmitManager.getLastSubmitDate(
      selectedToolId.value.id
    );

    ElMessage({
      message: "评分提交成功，感谢您的参与！",
      type: "success",
    });
  });
};

// 使用防抖包装提交函数
const submitRating = debounceStore.debounce(handleSubmitRating, 500);

onMounted(() => {
  selectedToolId.value = JSON.parse(
    localStorage.getItem("selectedTool") as any
  );
  scoreStore.ToolsDetailGet(selectedToolId.value.id);

  // 获取上次提交日期
  if (selectedToolId.value?.id) {
    lastSubmitDate.value = debounceStore.dailySubmitManager.getLastSubmitDate(
      selectedToolId.value.id
    );
  }
});
</script>

<style scoped lang="scss">
@use "@/styles/_variables.scss" as *;
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-container {
  margin: 20px 30px 10px 30px;
  padding: 15px 20px;
  display: flex;
  flex-direction: row;
  gap: 30px;
}

.main-score-container {
  flex: 0.6;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.main-upload-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-style: italic;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eaeaea;
  width: 100%;

  .el-icon {
    font-size: $xxlarge-font-size;
    color: var(--score-title-icon-color);
  }
}

.content {
  width: 100%;
}

.rating-container {
  width: 100%;
  padding: 5px 0 5px 20px;
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0;
  padding: 6px 0;
  border-bottom: 1px dashed #eaeaea;

  &:last-child {
    border-bottom: none;
  }
}

.rating-title {
  min-width: 80px;
  font-weight: 500;
  font-size: $medium-font-size;
  color: var(--text-color);
}

.score-label {
  font-size: $medium-font-size;
  color: #409eff;
  font-weight: 500;
}

.criteria-header {
  font-weight: bold;
  margin-bottom: 10px;
  color: #409eff;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 5px;
}

.criteria-list {
  max-width: 100%;
  padding: 0 0 0 20px;

  li {
    margin-bottom: 8px;
    text-align: left;
    line-height: 1.4;
    font-size: $small-font-size;
    color: var(--text-color);
  }
}

.comment {
  margin: 20px 0;
  width: 100%;

  .comment-title {
    display: block;
    margin-bottom: 12px;
    color: var(--text-color);
    font-weight: 500;
  }

  .comment-input {
    width: 100%;

    :deep(.el-textarea__inner) {
      border-radius: 8px;
      padding: 12px;
      transition: all 0.3s ease;

      &:focus {
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }
  }
}

.submit-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 15px;

  .submit-btn {
    padding: 10px 24px;
    font-size: 15px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }
  }

  .submit-info {
    margin-top: 10px;
    font-size: 13px;
    color: #909399;
  }
}

// 工具评分展示
.tool-details {
  width: 100%;
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.score-title {
  font-size: 20px;
}

.score-content {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.score-content-item-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;

  .user-avatar {
    background-color: #409eff;
    color: white;
  }
}

.score-content-item-content {
  font-size: 15px;
  color: var(--text-color);
  margin: 10px 0;
  line-height: 1.6;
  padding: 5px 0;
  border-top: 1px dashed #eaeaea;
  border-bottom: 1px dashed #eaeaea;
}

.score-content-item-score {
  font-size: 14px;
  color: #ff9800;
  font-weight: bold;

  span {
    color: #909399;
    font-weight: normal;
  }
}

:deep(.el-popover.el-popper) {
  max-width: none;
  width: 300px !important;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>
