<template>
  <div>
    <div class="main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="category in categories"
          :label="category"
          :name="category"
          :key="category"
        >
          <div class="cat-main">
            <Card
              v-for="(tool, index) in toolsByCategory[category]"
              :key="index"
              class="tool-card"
            >
              <template #header>
                <img
                  :src="tool.logoUrl"
                  style="width: 120px"
                  @click="gotoDetail"
                />
              </template>
              <p @click="gotoDetail">{{ tool.name }}</p>
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
import axios from "axios";
import type { TabsPaneContext } from "element-plus";

// Vue 状态管理
const activeName = ref("first"); // 默认激活标签页为"办公助手"
const categories = ref<string[]>([]); // 所有的类别
const toolsByCategory = ref<Record<string, Tool[]>>({}); // 按类别分组的工具列表

// 处理标签点击事件
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// 跳转到工具网站
const gotoSite = (url: string) => {
  window.location.href = url;
};

// 跳转到工具详情页面
const gotoDetail = () => {
  const route = useRouter();
  route.push("/detail");
};

// 工具类型接口
interface Tool {
  id: number;
  name: string;
  logoUrl: string;
  url: string;
  score: number;
  category: string;
}

// 获取工具类别列表
onMounted(() => {
  axios
    .get("/api/tools/categories")
    .then((resp) => {
      categories.value = resp.data.data; // 假设接口返回一个类别数组
      loadTools(); // 获取工具数据
    })
    .catch((error) => {
      console.error("获取类别列表失败:", error);
    });
});

// 获取每个类别下的工具列表
const loadTools = () => {
  categories.value.forEach((category) => {
    axios
      .get(`/api/tools?category=${category}`)
      .then((resp) => {
        console.log(resp.data.data); // 打印返回的工具列表
        toolsByCategory.value[category] = resp.data.data; // 假设返回的数据结构为 { data: [...] }
      })
      .catch((error) => {
        console.error(`获取 ${category} 工具失败:`, error);
      });
  });
};
</script>

<style scoped>
.search {
  height: 45px;
  background-color: rgba(153, 109, 242, 0.493);
}
.main {
  margin: 5px 0;
  /* background-color: rgba(222, 184, 135, 0.459); */
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
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
