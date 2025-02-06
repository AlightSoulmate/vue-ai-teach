<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">{{
        cats
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tool.category }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tool.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-info">
      <div class="info">
        <div class="name">{{ tool.name }}</div>
        <div class="score">
          <span class="txt">当前评分</span> {{ tool.score }} ⭐
        </div>
        <div class="description">{{ tool.description }}</div>
        <div class="tag">标签：...</div>
        <div class="url" @click="gotoSite(tool.url)">
          访问官网：{{ tool.url }}
        </div>
        <br />
        <div class="feedback">反馈</div>
      </div>
      <img :src="tool.logoUrl" />
    </div>
    <div>
      <Score />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";
import { ref, onMounted } from "vue";
import Score from "./score.vue";
const cats = ref("全部工具");
const selectToolStore = useSelectedToolStore();
const tool = ref<any>({});
onMounted(() => {
  // 从localStorage拿selectedTool用，顺便赋给selectToolStore.selectedTool
  const selectedTool = localStorage.getItem("selectedTool");
  if (selectedTool) {
    selectToolStore.selectedTool = JSON.parse(selectedTool);
    tool.value = selectToolStore.selectedTool;
  }
  console.log(tool.value);
});
const gotoSite = (url: string) => {
  window.location.href = url;
};
</script>
<style scoped>
* {
  margin: 0 auto;
  padding: 0 auto;
  box-sizing: border-box;
}
.container {
  max-width: 1200px;
  padding: 50px 30px;
}
.main-info {
  margin: 30px 30px 10px 30px;
  padding: 0 20px;
  height: 300px;
  /* background-color: antiquewhite; */
  display: flex;
}
.main-info .info {
  flex: 1;
}
.main-info .name {
  display: inline-block;
  margin-top: 20px;
  font-style: italic;
  font-weight: bold;
  font-size: 52px;
  text-align: left;
  max-height: 100px;
}
.main-info .score {
  display: inline-block;
  font-style: italic;
  font-weight: bold;
  font-size: 30px;
  margin: 0 10px 0 30px;
}
.main-info .score .txt {
  font-size: 20px;
  font-weight: lighter;
}

.main-info .description {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  color: rgb(110, 110, 110);
  font-size: 20px;
  max-height: 60px;
}
.main-info .tag {
  display: flex;
  margin-top: 10px;
  color: rgb(110, 110, 110);
}
.main-info .url {
  display: inline-block;
  padding: 10px;
  margin-top: 25px;
  cursor: pointer;
  font-weight: bold;
  color: aliceblue;
  background-color: rgb(253, 127, 2);
  border-radius: 10px;
  box-shadow: 2px 2px 5px gray;
}
.main-info .feedback {
  flex-wrap: wrap;
  display: inline-block;
  margin-top: 20px;
  margin-left: 10px;
  width: 34px;
  height: 34px;
  line-height: 32px;
  text-align: center;
  font-size: 12px;
  color: #979696;
  border: 1px solid #979696;
  border-radius: 100%;
  cursor: pointer;
  box-shadow: 1px 1px 3px #ccc;
}
.main-info img {
  margin-right: 30px;
  max-width: 500px;
  max-height: 200px;
}
</style>
