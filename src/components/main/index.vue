<template>
  <el-container>
    <header class="header">
      <div class="title">
        <h1 id="titleH1">{{ titleH1 }}</h1>
        <!-- <h2 id="titleH2">
          {{ titleH2 }}
        </h2> -->
      </div>
    </header>
    <el-main class="main">
      <div>
        <div class="main">
          <el-tabs
            v-model="activeName"
            class="demo-tabs"
            @tab-click="handleClick"
          >
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
    </el-main>
    <el-footer>
      <div class="footer">Footer</div>
    </el-footer>
  </el-container>
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
const titleH1 = ref("AI / LLM 模型工具集");
const titleH2 = ref(
  "100+中文 AI / LLM工具本站链接直达、体验工具后可以留下您对它的评价并写下评分的依据，谢谢！"
);
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

<style scoped lang="scss">
@use "../../styles/variables.scss" as *;
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.el-container {
  background-color: var(--background-color);
}
#titleH1 {
  margin: $mains-title-margin;
  font-size: $mains-title-font-size;
  font-weight: $mains-title-font-weight;
  color: var(--text-color);
}
#titleH2 {
  margin: $mains-title-margin;

  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: normal;
}
.main {
  border-top: 1px solid #ebeef5;
  padding: 0 5px;
}
.cat-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}
.gotoSite {
  cursor: pointer;
  border: none;
  color: var(--text-color);
  background: transparent;
  font-size: 13px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #ff7300;
  font-size: 32px;
  font-weight: 600;
}
.el-tabs--top > .el-tabs__header .el-tabs__item {
  color: #ffffff !important;
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
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  text-align: left;
  padding-left: 10px;
}

.footer {
  padding: 20px;
  background-color: #f0f0f0;
}
</style>
