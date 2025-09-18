<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { Checked, ChatDotRound, Microphone } from "@element-plus/icons-vue";
import { useScoreStore } from "@/stores/useScoreStore";
import { useDebounceStore } from "@/stores/useDebounceStore";
import type { ScrollbarInstance } from "element-plus";

interface SelectedTool {
  id: string | number;
  [key: string]: any;
}

const max = ref(0);
const value = ref(0);
const inputLess = ref(false);
const scrollHeight = ref<number>(360);
const innerRef = ref<HTMLDivElement>();
const scrollbarRef = ref<ScrollbarInstance>();
const submitRef = ref();
const scoreStore = useScoreStore();
const debounceStore = useDebounceStore();
const selectedToolId = ref<SelectedTool>({ id: "" });
const lastSubmitDate = ref("");
const hasSubmittedCurrentTool = ref(false);

const MIN_COMMENT_LENGTH = 10;
const DEBOUNCE_DELAY = 500;
const RATE_COLORS = ["#C6D1DE", "#409EFF", "#67C23A"];
const RATE_MAX = 5;

const getToolFromStorage = (): SelectedTool => {
  try {
    return JSON.parse(localStorage.getItem("selectedTool") || '{"id": ""}');
  } catch (error) {
    console.error("解析工具数据失败:", error);
    return { id: "" };
  }
};

const showMessage = (
  message: string,
  type: "success" | "error" | "warning" | "info" = "success"
) => {
  ElMessage({
    message,
    type,
    duration: 3000,
    showClose: true,
  });
};

const toNumber = (value: string | number): number => {
  return typeof value === "string" ? parseInt(value, 10) : value;
};

const canSubmit = computed(() => {
  return (
    !hasSubmittedCurrentTool.value &&
    !debounceStore.isSubmitting &&
    selectedToolId.value?.id
  );
});

const submitButtonText = computed(() => {
  if (debounceStore.isSubmitting) return "提交中...";
  if (hasSubmittedCurrentTool.value) return "今日已提交";
  return "提交评分";
});

const reversedRates = computed(() => {
  const rates = [...(scoreStore.toolsDetail.rates || [])].reverse();
  // 过滤掉没有评论内容的项
  return rates.filter((rate) => rate.comment && rate.comment.trim() !== "");
});

const resetEvaluationState = () => {
  scoreStore.rateStandards.forEach((standard) => {
    standard.score = 0;
  });
  scoreStore.rate.comment = "";
  hasSubmittedCurrentTool.value = false;
  lastSubmitDate.value = "";
};

const handleSubmitRating = async () => {
  try {
    await debounceStore.withSubmitLock(async () => {
      const tool = getToolFromStorage();
      selectedToolId.value = tool;

      if (!tool.id) {
        throw new Error("未找到工具ID");
      }

      const toolId = toNumber(tool.id);
      await scoreStore.evaluationTransmission(toolId);

      hasSubmittedCurrentTool.value = true;
      lastSubmitDate.value = new Date().toISOString().split("T")[0];

      showMessage("评分提交成功，感谢您的参与！", "success");
    });
  } catch (error) {
    console.error("提交评分失败:", error);
    showMessage("提交失败，请稍后重试", "error");
  }
};

const inputSlider = (value: number) => {
  scrollbarRef.value?.setScrollTop(value);
};

const scroll = ({ scrollTop }: { scrollTop: number }) => {
  value.value = scrollTop;
};

const formatTooltip = (value: number) => `${value} px`;

watch(
  () => getToolFromStorage().id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      console.log("工具ID变化，重置评分状态:", oldId, "->", newId);
      resetEvaluationState();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    const tool = getToolFromStorage();
    selectedToolId.value = tool;
    resetEvaluationState();

    if (tool.id) {
      const toolId = toNumber(tool.id);
      try {
        await scoreStore.ToolsDetailGet(toolId);
      } catch (detailError: any) {
        ElMessage.error("获取工具详情失败:", detailError);
        throw detailError;
      }
    }

    await nextTick();
    if (innerRef.value) {
      max.value = Math.max(0, innerRef.value.clientHeight - scrollHeight.value);
    }
  } catch (error: any) {
    ElMessage.error("初始化失败:", error);
    showMessage("初始化失败，请刷新页面重试", "error");
  }
});

watch(
  () => scoreStore.rate.comment?.length,
  (newLength) => {
    inputLess.value = (newLength ?? 0) < MIN_COMMENT_LENGTH;
  }
);

const submitRating = debounceStore.debounce(handleSubmitRating, DEBOUNCE_DELAY);
</script>

<template>
  <div class="main-container">
    <div class="main-score-container">
      <div class="title">
        <el-icon>
          <Checked />
        </el-icon>评分模块
      </div>
      <div class="content">
        <div class="rating-container">
          <el-popover v-for="(standard, index) in scoreStore.rateStandards" :key="index" :width="400" placement="right"
            trigger="hover">
            <template #reference>
              <div class="rating-item">
                <span class="rating-title">{{ standard.name }}：</span>
                <el-rate v-model="standard.score" :max="RATE_MAX" allow-half :colors="RATE_COLORS" />
                <span class="score-label">{{ standard.score }} 分</span>
              </div>
            </template>
            <template #default>
              <div class="criteria-container">
                <div class="criteria-header">评分标准</div>
                <ul class="criteria-list">
                  <li v-for="(criteria, idx) in standard.criteria" :key="idx">
                    {{ criteria }}
                  </li>
                </ul>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="comment">
          <el-input type="textarea" placeholder="留下您的宝贵评价，帮助其他用户了解此工具 （每个工具每日仅限一次评价）" class="comment-input"
            :autosize="{ minRows: 3, maxRows: 6 }" maxlength="500" v-model="scoreStore.rate.comment"
            :disabled="!canSubmit" />
          <p v-if="inputLess" class="input-less">
            输入的字符数少于{{ MIN_COMMENT_LENGTH }}个!
          </p>
        </div>
        <div class="submit-wrapper">
          <div class="submit-buttons">
            <el-button type="primary" @click="submitRating" class="submit-btn" :disabled="!canSubmit"
              :loading="debounceStore.isSubmitting" ref="submitRef">
              {{ submitButtonText }}
            </el-button>
          </div>
          <div v-if="lastSubmitDate" class="submit-info">
            上次提交日期: {{ lastSubmitDate }}
          </div>
        </div>
      </div>
    </div>
    <div class="main-upload-container">
      <div class="score-title title">
        <el-icon>
          <ChatDotRound />
        </el-icon>用户评价
      </div>
      <el-scrollbar class="tool-details" always @scroll="scroll" ref="scrollbarRef" :height="`${scrollHeight}px`">
        <div ref="innerRef">
          <template v-if="reversedRates && reversedRates.length > 0">
            <div class="score-content" v-for="score in reversedRates" :key="score.id"
              v-show="score.comment && score.comment.trim()">
              <div class="score-content-item">
                <div class="score-header">
                  <div class="score-content-item-title">
                    <el-avatar :size="24" class="user-avatar">
                      {{ score.user.charAt(0) }}
                    </el-avatar>
                    <span class="user-nickname">@{{ score.user || "未设置昵称用户" }}</span>
                    <span class="user-nickname"> {{ score.cno || "-" }}</span>
                    <span class="user-nickname"> &nbsp;&nbsp;{{ score.rate_time.replace("T", " ") || "-" }}</span>
                  </div>
                  <div class="score-content-item-score">
                    <span>评分：</span>{{ score.rating }} ⭐
                  </div>
                </div>
                <div class="score-content-item-content" v-if="score.comment">
                  {{ score.comment }}
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="no-comments">
              <el-icon class="icon">
                <ChatDotRound />
              </el-icon>
              <div class="message">暂无用户评价</div>
              <div class="sub-message">成为第一个评价此工具的用户吧</div>
            </div>
          </template>
        </div>
      </el-scrollbar>
      <el-slider v-if="max > 0 && reversedRates && reversedRates.length > 0" v-model="value" :max="max"
        :format-tooltip="formatTooltip" @input="inputSlider" />
    </div>
  </div>
</template>

<style scoped lang="scss">
$border-radius: 12px;
$box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
$hover-box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
$transition-duration: 0.3s;
$primary-color: #409eff;
$gradient-start: #3498db;
$gradient-end: #2c3e50;
$warning-color: #ff9800;
$text-secondary: #909399;

@mixin flex-center {
  display: flex;
  align-items: center;
}

@mixin hover-effect {
  transition: all $transition-duration ease;

  &:hover {
    box-shadow: 0 8px 20px rgba($gradient-start, 0.12);
    transform: translateY(-1px);
  }
}

@mixin card-style {
  background: var(--background-color);
  border-radius: $border-radius;
  box-shadow: 0 6px 16px rgba($gradient-start, 0.08);
  border: 1px solid rgba($gradient-start, 0.05);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-container {
  margin: 20px 0 10px;
  padding: 24px 20px;
  display: flex;
  gap: 40px;
}

.main-score-container {
  flex: 0.4;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 270px;

  .content {
    width: 100%;
  }
}

.title {
  @include flex-center;
  gap: 12px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba($gradient-start, 0.1);
  width: 100%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 120px;
    height: 2px;
    background: linear-gradient(to right, $gradient-start, $gradient-end);
  }

  .el-icon {
    font-size: 22px;
    color: $gradient-start;
  }
}

.rating-container {
  width: 100%;
  padding: 15px;
  @include card-style;
  margin-bottom: 24px;
  @include hover-effect;

  .rating-item {
    @include flex-center;
    gap: 16px;
    margin: 10px 0;
    padding: 12px 14px;
    border-radius: 8px;
    transition: all $transition-duration ease;

    &:hover {
      background: rgba($gradient-start, 0.03);
    }

    &:not(:last-child) {
      border-bottom: 1px solid rgba($gradient-start, 0.1);
      padding-bottom: 15px;
    }

    .rating-title {
      min-width: 90px;
      font-weight: 500;
      font-size: 15px;
      color: $gradient-end;
    }

    .score-label {
      font-size: 15px;
      margin-left: 8px;
      color: $gradient-start;
      font-weight: 500;
    }
  }
}

.criteria-container {
  padding: 15px;
  background-color: var(--background-color);

  .criteria-header {
    font-size: 16px;
    font-weight: 600;
    color: $gradient-start;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba($gradient-start, 0.1);
  }

  .criteria-list {
    padding-left: 20px;

    li {
      margin-bottom: 8px;
      color: var(--text-color);
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: -15px;
        top: 8px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: $gradient-start;
      }
    }
  }
}

.comment {
  margin-bottom: 24px;
  width: 100%;

  .comment-input {
    :deep(.el-textarea__inner) {
      background-color: var(--background-color);
      border-radius: 8px;
      border: 1px solid rgba($gradient-start, 0.2);
      transition: all $transition-duration ease;

      &:focus {
        border-color: $gradient-start;
        box-shadow: 0 0 0 2px rgba($gradient-start, 0.1);
      }

      &:hover {
        border-color: $gradient-start;
      }
    }
  }

  .input-less {
    color: $warning-color;
    font-size: 13px;
    margin-top: 6px;
    padding-left: 5px;
  }
}

.submit-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .submit-buttons {
    display: flex;
    align-items: center;
    gap: 15px;

    .mic-icon {
      font-size: 24px;
      color: $gradient-start;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      background: rgba($gradient-start, 0.1);
      transition: all $transition-duration ease;

      &:hover {
        transform: scale(1.1);
        background: rgba($gradient-start, 0.2);
      }
    }

    .submit-btn {
      background: linear-gradient(135deg, $gradient-start, $gradient-end);
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-weight: 500;
      box-shadow: 0 4px 10px rgba($gradient-start, 0.3);
      transition: all $transition-duration ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 15px rgba($gradient-start, 0.4);
      }

      &:disabled {
        opacity: 0.7;
        background: linear-gradient(135deg,
            rgba($gradient-start, 0.6),
            rgba($gradient-end, 0.6));
      }
    }
  }

  .submit-info {
    font-size: 13px;
    color: $text-secondary;
  }
}

.main-upload-container {
  flex: 0.6;
  min-width: 300px;
}

.tool-details {
  @include card-style;
  padding: 15px 16px;
  margin-bottom: 15px;
  @include hover-effect;
  max-height: 444px;
}

.score-content {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  .score-content-item {
    padding: 14px 16px;
    border-radius: 10px;
    background: rgba($gradient-start, 0.03);
    border: 1px solid rgba($gradient-start, 0.08);
    transition: all $transition-duration ease;
    display: flex;
    flex-direction: column;
    min-height: auto;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 16px rgba($gradient-start, 0.1);
      background: rgba($gradient-start, 0.05);
    }

    .score-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px dashed rgba($gradient-start, 0.1);

      .score-content-item-title {
        @include flex-center;
        gap: 8px;

        .user-avatar {
          background: linear-gradient(135deg, $gradient-start, $gradient-end);
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 10px rgba($gradient-start, 0.2);
        }

        .user-nickname {
          font-weight: 500;
          color: $gradient-end;
          font-size: 13px;
        }
      }

      .score-content-item-score {
        color: $gradient-start;
        font-weight: 500;
        padding: 2px 10px;
        background: rgba($gradient-start, 0.05);
        border-radius: 20px;
        font-size: 14px;

        span {
          color: $text-secondary;
          font-weight: normal;
        }
      }
    }

    .score-content-item-content {
      color: var(--text-color);
      line-height: 1.5;
      font-size: 13px;
      padding: 0 2px 2px 2px;
      margin-top: -2px;
    }
  }
}

.no-comments {
  text-align: center;
  padding: 30px 0;
  color: $text-secondary;

  .icon {
    font-size: 50px;
    color: rgba($gradient-start, 0.2);
    margin-bottom: 15px;
  }

  .message {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .sub-message {
    font-size: 13px;
    opacity: 0.8;
  }
}

:deep(.el-slider) {
  margin-top: 20px;

  .el-slider__bar {
    background-color: $gradient-start;
  }

  .el-slider__button {
    border-color: $gradient-start;
  }
}

@media (max-width: 1200px) {
  .main-container {
    padding: 20px 15px;
    gap: 30px;
  }
}

@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
    padding: 15px 10px;
  }

  .main-score-container,
  .main-upload-container {
    flex: 1;
    width: 100%;
    min-width: 100%;
  }

  .tool-details {
    max-height: 350px;
  }

  .title::after {
    width: 100px;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 10px 5px;
    margin: 10px 0;
  }

  .rating-container .rating-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    .rating-title {
      margin-bottom: 5px;
    }
  }

  .score-content-item {
    padding: 12px 14px;

    .score-header {
      padding-bottom: 4px;
      margin-bottom: 8px;

      flex-wrap: wrap;
      gap: 8px;

      .score-content-item-title {
        flex: 1;
        min-width: 120px;
      }

      .score-content-item-score {
        font-size: 13px;
        padding: 1px 8px;
      }
    }
  }
}

@media (min-height: 900px) {
  .score-content-item {
    padding: 12px 14px;

    .score-header {
      margin-bottom: 8px;
      padding-bottom: 4px;
    }

    .score-content-item-content {
      line-height: 1.4;
    }
  }
}
</style>
