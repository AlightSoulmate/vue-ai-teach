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
          >
            <template #reference>
              <div class="rating-item">
                <span class="rating-title">{{ dimension.name }}：</span>
                <el-rate v-model="dimension.score" :max="5" allow-half />
                <span class="score-label">{{ dimension.score }} 分</span>
              </div>
            </template>
            <template #default class="above-criteria-list">
              <ul class="criteria-list">
                <li v-for="(criteria, idx) in dimension.criteria" :key="idx">
                  {{ criteria }}
                </li>
              </ul>
            </template>
          </el-popover>
        </div>
        <div class="comment">
          <span class="comment-title">请键入您对工具的整体评价：</span>
          <el-input
            type="textarea"
            placeholder="在此处输入"
            class="comment-input"
            :autosize="{ minRows: 2 }"
            v-model="scoreStore.ratingEvaluation.comment"
          />
        </div>
        <el-button type="primary" @click="submitRating" class="submit"
          >提交评分</el-button
        >
      </div>
    </div>
    <div class="main-upload-container">
      <div class="score-title title">
        <el-icon><Checked /></el-icon>用户评价：
      </div>
      <div class="tool-details">
        <div
          class="score-content"
          v-for="score in scoreStore.toolsDetail.rates"
          :key="score.id"
        >
          <div class="score-content-item">
            <div class="score-content-item-title">用户：{{ score.user }}</div>
            <div class="score-content-item-content">
              评价：{{ score.comment }}
            </div>
            <div class="score-content-item-score">评分：{{ score.rating }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Checked } from "@element-plus/icons-vue";
import { useScoreStore } from "@/stores/useScoreStore";

const scoreStore = useScoreStore();
const selectedToolId = ref<any>({});
const submitRating = () => {
  console.log("评分结果:", scoreStore.ratingDimensions);
  selectedToolId.value = JSON.parse(
    localStorage.getItem("selectedTool") as any
  );
  console.log(selectedToolId.value);
  scoreStore.evaluationTransmission(selectedToolId.value.id);
  // scoreStore.evaluationAssign();

  ElMessage({
    message: "评分提交成功，请勿重复提交！",
    type: "success",
  });
};
onMounted(() => {
  selectedToolId.value = JSON.parse(
    localStorage.getItem("selectedTool") as any
  );
  scoreStore.ToolsDetailGet(selectedToolId.value.id);
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
  padding: 5px 20px;
  display: flex;
  flex-direction: row;
}
.main-score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.main-upload-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 25px;
  align-items: flex-end;
}
.main-upload-container .main-upload-title {
  margin-top: -1px;
  margin-right: 135px;
  align-self: self-end;
  white-space: nowrap;
}
.title {
  align-self: flex-start;
  font-style: italic;
  font-weight: bold;
  color: var(--text-color);
  margin-left: 10px;
  margin-bottom: 20px;
}
.title .el-icon {
  font-size: $xxlarge-font-size;
  top: 4.3px;
  right: 2px;
  color: var(--score-title-icon-color);
}
.content {
  display: inline-block;
}

.rating-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 5px 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}
.rating-title {
  font-weight: medium;
  font-size: $medium-font-size;
}
.score-label {
  font-size: $medium-font-size;
  color: #666;
}
.above-criteria-list {
  width: 100%;
  max-width: 800px !important;
  margin: 0 auto;
}

.submit {
  margin-top: 10px;
  font-size: 14px;
  padding: 5px 10px;
}
.comment {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}
.comment .comment-title {
  display: block;
  margin: 10px 0;
  color: var(--text-color);
}
.comment .comment-input {
  display: block;
}

.criteria-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 5px 0 5px 10px;
}

.criteria-list li {
  margin-bottom: 2px;
  text-align: left;
  line-height: 1.2;
  font-size: $small-font-size;
}

:deep(.el-popover.el-popper) {
  max-width: none;
  width: 300px !important;
}

//工具评分展示
.tool-details {
  width: 100%;
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  margin-top: 20px;
}

.score-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-color);
}

.score-content {
  margin-bottom: 15px;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.score-content-item {
  margin-bottom: 10px;
}

.score-content-item-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.score-content-item-content {
  font-size: 14px;
  color: #7f8c8d;
  margin: 5px 0;
}

.score-content-item-score {
  font-size: 14px;
  color: #16a085;
  font-weight: bold;
}
</style>
