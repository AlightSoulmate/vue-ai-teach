<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToolsStore } from "@/stores/useToolsStore";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";
import { change } from "@/services/AuthService";
import { ElMessage } from "element-plus";
import { Search, Refresh } from "@element-plus/icons-vue";
import Card from "@/components/main/Card.vue";
import BackTop from "@/components/use/backTop.vue";
import Foot from "@/components/main/components/Foot.vue";
import type { FormInstance, FormRules } from "element-plus";

const route = useRouter();
const toolsStore = useToolsStore();
const selectToolStore = useSelectedToolStore();
const activeName = ref("AI对话工具");
const titleH1 = "AI / LLM 模型工具集";

const loading = ref(true);
const initialLoading = ref(true);
const authStore = useAuthStore();

const searchText = ref("");
const showSearchResults = ref(false);
const selectedTool = ref<any>(null);

const createFilter = (queryString: string) => {
  return (tool: any) => {
    return (
      tool.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1 ||
      tool.description.toLowerCase().indexOf(queryString.toLowerCase()) !==
      -1 ||
      tool.category.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
    );
  };
};

// 搜索防抖优化
const debounce = (fn: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const querySearchAsync = debounce((queryString: string, callback: Function) => {
  const allTools = Object.values(toolsStore.currentCategoryTools || {}).flat();
  const results = queryString ? allTools.filter(createFilter(queryString)) : [];
  callback(
    results.map((tool) => ({
      value: tool.name,
      ...tool,
    }))
  );
}, 300);

// 处理工具选择
const handleSearchSelect = (item: any) => {
  selectedTool.value = item;
  searchText.value = item.name;
  showSearchResults.value = false;
  selectToolStore.selectTool(item);
  route.push("/detail");
};

const clearSearch = () => {
  searchText.value = "";
  selectedTool.value = null;
  showSearchResults.value = false;
};

const gotoDetail = (tool: any) => {
  selectToolStore.selectTool(tool);
  route.push("/detail");
};

const originalCategoryOrder = ref<string[]>([]);
const displayCategories = ref<string[]>([]);

const handleSelect = async (category: string) => {
  await toolsStore.loadCategoryTools(category);
  activeName.value = toolsStore.loadedCategory;
  localStorage.setItem("activeName", JSON.stringify(activeName.value));

  const updatedCategories = [...displayCategories.value];
  const index = updatedCategories.indexOf(category);

  if (index > 0) {
    updatedCategories.splice(index, 1);
    updatedCategories.unshift(category);
    displayCategories.value = updatedCategories;
  }
};

// 修改密码和昵称
const passwordDialogVisible = ref(false);
const passwordFormRef = ref<FormInstance>();

// 表单数据
const passwordForm = reactive({
  nickname: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 密码表单验证规则
const passwordRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度必须在6-18位之间", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

// 提交修改
const submitPasswordChange = () => {
  passwordFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const data = await change(
          authStore.user.token,
          passwordForm.nickname,
          passwordForm.oldPassword,
          passwordForm.newPassword,
          authStore.user.username,
        );
        authStore.user.token = data.Authorization;
        authStore.isFresh = 0;
        localStorage.setItem("isFresh", JSON.stringify(authStore.isFresh));
        ElMessage.success("修改成功");
        passwordDialogVisible.value = false;
        // 重置表单
        passwordForm.oldPassword = "";
        passwordForm.newPassword = "";
        passwordForm.confirmPassword = "";
        passwordForm.nickname = "";
      } catch {
        ElMessage.error("修改失败");
      }
    }
  });
};

onMounted(async () => {
  // 1. 检查是否已登录
  authStore.checkAuth();
  if (authStore.isFresh === 1 && authStore.user.role === "student") {
    passwordDialogVisible.value = true;
  }

  // 2. 加载工具列表
  initialLoading.value = true;
  loading.value = true;

  await toolsStore.fetchCategory();
  activeName.value = JSON.parse(localStorage.getItem("activeName") || "AI对话工具");

  originalCategoryOrder.value = [...toolsStore.categories];
  displayCategories.value = [...toolsStore.categories];

  initialLoading.value = false;
  loading.value = false;

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", handleScroll);
    scrollContainer.value.setAttribute("data-scroll-listener", "true");
  }

  console.log(toolsStore.currentCategoryTools);
});

const scrollContainer = ref<HTMLElement | null>(null);

const handleScroll = () => {
  if (!scrollContainer.value) return;
  const { scrollTop } = scrollContainer.value;
  updateActiveCategory(scrollTop);
};

const updateActiveCategory = (scrollTop: number) => {
  if (!scrollContainer.value) return;

  const categoryElements = document.querySelectorAll(".category-section");
  const offset = 150;
  const containerTop = scrollContainer.value.getBoundingClientRect().top;

  for (let i = 0; i < categoryElements.length; i++) {
    const element = categoryElements[i] as HTMLElement;
    const elementTop = element.getBoundingClientRect().top - containerTop;
    const elementBottom = elementTop + element.offsetHeight;

    if (elementTop <= offset && elementBottom > offset) {
      const category = element.querySelector(".category-header")?.id;
      if (category && category !== activeName.value) {
        activeName.value = category;
        localStorage.setItem("activeName", JSON.stringify(category));
      }
      return;
    }
  }
};

const resetCategoryOrder = () => {
  displayCategories.value = [...originalCategoryOrder.value];
  activeName.value = originalCategoryOrder.value[0] || "AI对话工具";
  localStorage.setItem("activeName", JSON.stringify(activeName.value));
};
</script>

<template>
  <el-container>
    <div class="main-container" ref="scrollContainer">
      <div class="hero-section" style="z-index: 0">
        <div class="hero-background">
          <div class="bg-gradient"></div>
          <div class="bg-pattern"></div>
        </div>

        <div class="hero-content">
          <h1 class="hero-title">{{ titleH1 }}</h1>
          <div class="hero-search">
            <el-autocomplete v-model="searchText" :fetch-suggestions="querySearchAsync" placeholder="搜索工具名称、描述或分类..."
              @select="handleSearchSelect" clearable @clear="clearSearch" class="search-input"
              popper-class="search-popper" :trigger-on-focus="false">
              <template #prefix>
                <el-icon class="search-icon">
                  <Search />
                </el-icon>
              </template>
              <template #default="{ item }">
                <div class="search-result-item">
                  <div class="search-result-logo-container">
                    <img :src="item.logo_url" :alt="item.name" class="search-result-logo" />
                  </div>
                  <div class="search-result-info">
                    <div class="search-result-name">{{ item.name }}</div>
                    <div class="search-result-category">
                      {{ item.category }}
                    </div>
                  </div>
                  <div class="search-result-score">
                    <span class="result-score">{{
                      item.score ?? Math.floor(Math.random() * 5)
                    }}</span>
                    <span class="result-star">⭐</span>
                  </div>
                </div>
              </template>
            </el-autocomplete>
          </div>

          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" width="24" height="22" stroke="currentColor" fill="none">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h6"></path>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-count">
                  400+
                </div>
                <div class="stat-label">工具数量</div>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-count">{{ toolsStore.categories.length }}</div>
                <div class="stat-label">分类数量</div>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                  </path>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-count">-</div>
                <div class="stat-label">评价数量</div>
              </div>
            </div>
          </div>
          <div style="width: inherit; margin-top:10px">
            如需上传报告作业，请使用以下工具：<a href="https://a1.x914.com/alight/i/2025/06/06/41le.png" target="_blank">查看开放工具列表</a>
          </div>
        </div>
      </div>

      <el-main class="main">
        <template v-if="!initialLoading">

          <div :class="['category-navbar', 'mode-grid']" id="category-navbar">
            <div class="navbar-header">
              <h3 class="navbar-title">工具分类</h3>
            </div>

            <div class="category-nav-content grid">
              <template v-for="category in toolsStore.categories" :key="category">
                <div :class="[
                  'category-nav-item',
                  activeName === category ? 'active' : '',
                ]" @click.stop="handleSelect(category)">
                  {{ category }}
                </div>
              </template>

              <div class="category-nav-item reset" @click.stop="resetCategoryOrder" title="恢复默认顺序">
                <el-icon>
                  <Refresh />
                </el-icon> 恢复默认
              </div>
            </div>
          </div>
          <div class="category-section">
            <div class="category-header" :id="activeName">
              <h2 class="category-title">{{ toolsStore.loadedCategory }}</h2>
              <div class="category-count">
                {{ toolsStore.currentCategoryTools?.length || 0 }} 个工具
              </div>
            </div>
          </div>

          <template v-if="toolsStore.isLoading">
            <div class="skeleton-container">
              <div v-for="i in 2" :key="i" class="skeleton-category">
                <div class="skeleton-title"></div>
                <div class="skeleton-cards">
                  <div v-for="j in 4" :key="j" class="skeleton-card">
                    <div class="skeleton-header"></div>
                    <div class="skeleton-body"></div>
                    <div class="skeleton-info"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="tools-grid">
              <Card v-for="(tool, index) in toolsStore.currentCategoryTools" :key="tool.id" class="tool-card"
                :style="{ '--index': index % 8 }" @click="gotoDetail(tool)">
                <template #header>
                  <div class="tool-logo">
                    <img :src="tool.logo_url" :alt="tool.name" :title="tool.name" />
                    <div class="tool-name">{{ tool.name }}</div>
                  </div>
                </template>
                <template #default>
                  <p class="tool-desc">{{ tool.description }}</p>
                </template>
                <template #info>
                  <div class="tool-info">
                    <div class="rating">
                      <span class="rating-score">
                        {{ (tool.score ?? 0).toFixed(1) }}
                        <svg class="icon" viewBox="0 0 1000 900" version="1.1" xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12">
                          <path
                            d="M512.009505 25.054894l158.199417 320.580987 353.791078 51.421464L767.995248 646.579761l60.432101 352.365345-316.417844-166.354615-316.436854 166.354615 60.432101-352.365345L0 397.057345l353.791078-51.421464z"
                            fill="#EFCE4A" p-id="2289" data-spm-anchor-id="a313x.search_index.0.i1.672b3a81KYHDAp"
                            class="selected"></path>
                        </svg>
                      </span>
                      <div class="rating-count">
                        已有
                        {{ tool.ratingCount ?? 0 }}
                        人评价
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="skeleton-container">
            <div v-for="i in 2" :key="i" class="skeleton-category">
              <div class="skeleton-title"></div>
              <div class="skeleton-cards">
                <div v-for="j in 4" :key="j" class="skeleton-card">
                  <div class="skeleton-header"></div>
                  <div class="skeleton-body"></div>
                  <div class="skeleton-info"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-main>

      <el-footer>
        <Foot />
      </el-footer>
    </div>

    <div class="backTop">
      <BackTop />
    </div>
  </el-container>

  <el-dialog v-model="passwordDialogVisible" title="首次登陆强制修改密码" width="400px" center destroy-on-close append-to-body
    :modal-append-to-body="true" class="password-dialog" :show-close="false" :close-on-press-escape="false"
    :close-on-click-modal="false">
    <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px" status-icon>
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请确认新密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPasswordChange">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
@use "./index.scss" as *;
</style>
