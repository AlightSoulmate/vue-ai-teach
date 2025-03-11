<template>
  <el-container>
    <div class="main-container">
      <div class="header">
        <div class="title">
          <h1 id="titleH1">{{ titleH1 }}</h1>
        </div>
      </div>
      <el-main class="main">
        <div
          v-for="category in toolsStore.categories"
          :label="category"
          :name="category"
          :key="category"
        >
          <div class="card-title" :id="category">{{ category }}</div>
          <div class="cat-main">
            <Card
              v-for="(tool, index) in toolsStore.toolsByCategory[category]"
              :key="index"
              class="tool-card"
              @click="gotoDetail(tool)"
            >
              <template #header>
                <div class="tool-logo">
                  <img :src="tool.logo_url" :title="tool.name" />
                  <div class="tool-name">{{ tool.name }}</div>
                </div>
              </template>
              <template #default>
                <p class="tool-desc" @click="gotoDetail(tool)">
                  {{ tool.description }}
                </p>
              </template>
              <template #info>
                <div class="tool-info">
                  <div class="rating">
                    <span class="rating-score">{{ tool.score }}</span>
                    <div class="rating-stars">
                      <el-rate
                        v-model="tool.score"
                        disabled
                        text-color="#ff9800"
                        score-template="{value}"
                        :show-score="false"
                      />
                    </div>
                  </div>
                  <div class="rating-count">
                    已有
                    {{ tool.ratingCount ?? Math.floor(Math.random() * 100) }}
                    人评分
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </el-main>
      <el-footer>
        <div class="footer">Footer</div>
      </el-footer>
    </div>
    <aside class="side-nav">
      <el-anchor
        :offset="65"
        :active="activeName"
        direction="vertical"
        type="default"
        @click="handleClick"
        @select="handleSelect"
        class="anchor"
      >
        <div class="anchor-title">分类导航</div>
        <el-anchor-link
          v-for="(category, idx) in toolsStore.categories"
          :key="category"
          :href="`#${category}`"
          :title="category"
        ></el-anchor-link>
      </el-anchor>
    </aside>
    <div class="backTop">
      <BackTop />
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import Card from "@/components/main/Card.vue";
import BackTop from "@/components/use/backTop.vue";
import { useRouter } from "vue-router";
import { useToolsStore } from "@/stores/useToolsStore";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};
const route = useRouter();
const toolsStore = useToolsStore();
const selectToolStore = useSelectedToolStore();
const titleH1 = ref("AI / LLM 模型工具集");
const titleH2 = ref(
  "100+中文 AI / LLM工具本站链接直达、体验工具后可以留下您对它的评价并写下评分的依据，谢谢！"
);
const activeName = ref("对话模型");

const gotoSite = (url: string) => {
  window.location.href = url;
};

const gotoDetail = (tool: any) => {
  selectToolStore.selectTool(tool);
  route.push("/detail");
};
const handleSelect = (category: string) => {
  activeName.value = category;
  localStorage.setItem("activeName", JSON.stringify(category));
  scrollToCategory(category);
};

onMounted(() => {
  toolsStore.fetchCategory();
  const storedActive = localStorage.getItem("activeName");
  storedActive
    ? (activeName.value = JSON.parse(storedActive))
    : (activeName.value = "对话模型");
  setTimeout(() => {
    handleSelect(activeName.value);
  }, 300);
});
const scrollToCategory = (category: string) => {
  const targetLink = document.querySelector(
    `.el-anchor a[href="#${category}"]`
  );
  if (targetLink) {
    (targetLink as HTMLElement).click();
  }
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.el-container {
  background-color: var(--background-color);
  display: flex;
  padding: 10px 0 10px 10px;
  width: 100%;
  min-height: 100vh;

  .main-container {
    flex: 1;
    max-width: calc(100% - 220px);
    min-width: 0;
    text-align: left;
    margin-right: 20px;
  }

  .header {
    background-color: var(--background-color);
    width: 100%;

    #titleH1 {
      margin: $mains-title-margin;
      font: {
        size: $mains-title-font-size;
        weight: $mains-title-font-weight;
      }
      color: var(--text-color);
    }
  }

  // 主要内容区
  .main {
    padding: 5px 10px 0 20px;

    .card-title {
      font: {
        size: 20px;
        weight: bold;
      }
      color: var(--text-color);
      padding: 10px 0 10px 20px;
      position: relative;
      cursor: pointer;

      &:hover::before {
        content: "#";
        color: #409eff;
        font-size: 22px;
        position: absolute;
        left: 0;
      }
    }
    .card-title:focus:after,
    .card-title:hover:after {
      width: 100%;
      left: 0%;
    }

    .card-title:after {
      content: "";
      pointer-events: none;
      bottom: -2px;
      left: 50%;
      position: absolute;
      width: 0%;
      height: 2px;
      color: var(--text-color);
      background-color: var(--text-color);
      transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
      transition-duration: 400ms;
      transition-property: width, left;
    }

    .cat-main {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .tool-card {
      cursor: pointer;
      max-width: 220px;
      justify-self: center;
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    .tool-logo {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;

      img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: 6px;
      }

      .tool-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .tool-desc {
      font-size: 12px;
      color: var(--text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      line-height: 1.3;
      max-height: 3em;
      margin: 0 0 4px 0;
      flex-grow: 1;
    }
    .tool-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .rating {
        display: flex;
        align-items: center;
        gap: 4px;

        .rating-score {
          font-size: 13px;
          font-weight: 600;
          color: #ff9800;
        }

        .rating-stars {
          line-height: 1;
          transform: scale(0.8);
          transform-origin: left;
        }
      }
    }
  }
}
.side-nav {
  position: fixed;
  right: 90px;
  top: 120px;
  .anchor-title {
    font: {
      size: 14px;
      weight: bold;
    }
    color: var(--text-color);
    padding-bottom: 10px;
  }
  .el-anchor__list,
  .el-anchor {
    background-color: var(--background-color);
  }
}
@media screen and (max-width: 768px) {
  .side-nav {
    display: none;
    width: 0;
  }
}
</style>
