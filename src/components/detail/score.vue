<template>
  <div class="main-container">
    <div class="title">评分模块</div>
    <div class="content">
      <el-collapse>
        <el-collapse-item
          v-for="(dimension, index) in scoreStore.ratingDimensions"
          :key="index"
          :title="dimension.name"
        >
          <div class="rating-item">
            <span class="rating-title">请打分：</span>
            <el-rate v-model="dimension.score" :max="5" show-score allow-half />
            <span class="score-label">{{ dimension.score }} 分</span>
          </div>
          <div class="basis">
            <span class="basis-title">请输入您的打分依据（不少于10字）：</span>
            <el-input
              type="textarea"
              placeholder="在此处输入"
              class="basis-input"
              :autosize="{ minRows: 2 }"
              v-model="scoreStore.ratingDimensions[index].basis"
            />
          </div>
          <p class="criteria-title">细分条目：</p>
          <ul>
            <li v-for="(criteria, idx) in dimension.criteria" :key="idx">
              {{ criteria }}
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
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
</template>
<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { useScoreStore } from "@/stores/useScoreStore";
const scoreStore = useScoreStore();

const submitRating = () => {
  console.log("评分结果:", scoreStore.ratingDimensions);
  const selectedToolId = JSON.parse(
    localStorage.getItem("selectedTool") as any
  );
  console.log(selectedToolId);
  scoreStore.evaluationTransmission(selectedToolId.id);
  scoreStore.evaluationAssign();
  ElMessage({
    message: "评分提交成功，请勿重复提交！",
    type: "success",
  });
};
</script>
<style scoped>
.main-container {
  margin: 20px 30px 10px 30px;
  padding: 5px 20px;
}
.title {
  font-style: italic;
  font-weight: bold;
}
.content-title {
  display: flex;
  margin: 10px 5px;
  padding: 5px;
  height: 200px;
  background-color: rgb(157, 100, 210);
}
.content {
  display: inline-block;
  margin: 5px;
  background-color: #666;
}

/* .rating-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
} */

.rating-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.rating-title {
  font-weight: bold;
}

.basis-title {
  font-weight: bold;
}
.basis-input {
  width: 230px;
}
.score-label {
  font-size: 14px;
  color: #666;
}

.criteria-title {
  font-weight: bold;
  margin-top: 10px;
}

ul {
  padding-left: 20px;
}

ul li {
  margin-bottom: 3px;
  font-size: 14px;
}
.submit {
  margin-top: 10px;
}
.el-collapse-item {
  width: 400px;
}
.comment {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}
.comment .comment-title {
  display: block;
  margin: 10px 0;
}
.comment .comment-input {
  display: block;
}
</style>
