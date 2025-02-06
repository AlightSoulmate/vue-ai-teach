<template>
  <nav>
    <TopNav />
  </nav>
  <header class="header">
    <div class="title">
      <h1 id="titleH1">{{ titleH1 }}</h1>
      <h2 id="titleH2">
        {{ titleH2 }}
      </h2>
    </div>
  </header>
  <el-container>
    <el-aside class="menus">
      <Menus />
    </el-aside>
    <el-container>
      <el-main class="main">
        <Mains />
      </el-main>
      <el-footer>
        <div class="footer">Footer</div>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
import TopNav from "@/components/topNav/main/index.vue";
import Menus from "@/components/menus/index.vue";
import Mains from "@/components/main/index.vue";
const titleH1 = ref("AI / LLM 模型工具集");
const titleH2 = ref(
  "100+AI / LLM工具本站链接直达、体验工具后可以留下您对它的评价并写下评分的依据，谢谢！"
);
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.menus {
  width: 60px;
  background-color: #f0f0f0;
  min-height: 100vh;
  border-right: 1px solid #ebeef5;
}
.main {
  padding: 20px;
}
.header {
  padding: 20px;
  background-color: #bec6ca7f;
}
.title {
  padding-left: 10px;
}
#titleH1 {
  font-size: 2.5rem;
  font-style: italic;
  color: #ffb700;
}
#titleH2 {
  font-size: 1.1rem;
  color: #6b6a6a;
  margin: 10px 0;
  font-weight: normal;
}
.footer {
  padding: 20px;
  background-color: #f0f0f0;
}
</style>
