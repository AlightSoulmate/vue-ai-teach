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
      <div class="title main-upload-title">
        <el-icon><Checked /></el-icon>
        作业上传批改模块
      </div>
      <div class="upload-content">
        <StudentUpload />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { Checked } from "@element-plus/icons-vue";
import { useScoreStore } from "@/stores/useScoreStore";
import StudentUpload from "@/components/student/index.vue";

const scoreStore = useScoreStore();

const submitRating = () => {
  console.log("评分结果:", scoreStore.ratingDimensions);
  const selectedToolId = JSON.parse(
    localStorage.getItem("selectedTool") as any
  );
  console.log(selectedToolId);
  scoreStore.evaluationTransmission(selectedToolId.id);
  // scoreStore.evaluationAssign();

  ElMessage({
    message: "评分提交成功，请勿重复提交！",
    type: "success",
  });
};
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
  // align-self: center;
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
  // margin: 5px;
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
  // width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 5px 0 5px 10px;
}

.criteria-list li {
  margin-bottom: 2px;
  text-align: left;
  line-height: 1.2;
  font-size: $small-font-size;
  // width: 100%;
}

:deep(.el-popover.el-popper) {
  max-width: none;
  width: 300px !important;
}

.upload-content {
  width: 450px;
  transition: width-animation 1s ease;
}
@keyframes width-animation {
  from {
    width: 600px;
  }
  to {
    width: 300px;
  }
}
@media (max-width: 800px) {
  .upload-content {
    max-width: 300px;
    min-width: 100px;
  }
}
</style>
