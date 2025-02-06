<template>
  <div>
    <div class="main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="category in toolsStore.categories"
          :label="category"
          :name="category"
          :key="category"
        >
          <div class="cat-main">
            <Card
              v-for="(tool, index) in toolsStore.toolsByCategory[category]"
              :key="index"
              class="tool-card"
            >
              <template #header>
                <img
                  :src="tool.logoUrl"
                  @click="gotoDetail(tool)"
                  :title="tool.name"
                />
              </template>
              <p @click="gotoDetail" :title="tool.name" class="name">
                {{ tool.name }}
              </p>
              <template #footer-left>
                <span class="star">{{ tool.score }} ⭐</span>
              </template>
              <template #footer-right>
                <button @click="gotoSite(tool.url)" class="gotoSite">
                  直达
                </button>
              </template>
            </Card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Card from "@/components/main/Card.vue";
import { useRouter } from "vue-router";
import type { TabsPaneContext } from "element-plus";
import { useToolsStore } from "@/stores/useToolsStore";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";
const route = useRouter();
const toolsStore = useToolsStore();
const selectToolStore = useSelectedToolStore();

const activeName = ref("对话模型");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
  activeName.value = tab.paneName as string;
  localStorage.setItem("activeName", JSON.stringify(activeName.value));
};

const gotoSite = (url: string) => {
  window.location.href = url;
};

const gotoDetail = (tool: any) => {
  selectToolStore.selectTool(tool);
  route.push("/detail");
};

onMounted(() => {
  toolsStore.fetchCategory();
  activeName.value =
    localStorage.getItem("activeName")?.split('"')[1] || "对话模型";
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.search {
  height: 45px;
  background-color: rgba(153, 109, 242, 0.493);
}
.main {
  margin: 5px 0;
}
.cat-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}
.gotoSite {
  cursor: pointer;
  border: none;
  background: transparent;
  font-weight: lighter;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #ff7300;
  font-size: 32px;
  font-weight: 600;
}
.tool-card {
  cursor: pointer;
}
.tool-card img {
  width: 68px !important;
}

.name {
  max-width: 100%;
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏溢出的部分 */
  text-overflow: ellipsis;
  font-weight: bold;
  text-align: left;
  padding-left: 10px;
}
</style>
