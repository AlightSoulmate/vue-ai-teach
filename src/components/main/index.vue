<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  computed,
  onBeforeUnmount,
  watch,
  shallowRef,
} from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToolsStore } from "@/stores/useToolsStore";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";
import { change } from "@/services/AuthService";
import { ElMessage } from "element-plus";
import { Search, ArrowDown as Arrow, Refresh } from "@element-plus/icons-vue";
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
  const allTools = Object.values(toolsStore.toolsByCategory || {}).flat();
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

// 保存原始分类顺序
const originalCategoryOrder = ref<string[]>([]);
// 用于显示的分类顺序
const displayCategories = ref<string[]>([]);

const handleSelect = (category: string) => {
  activeName.value = category;
  localStorage.setItem("activeName", JSON.stringify(category));

  // 更新分类顺序，将选中的分类放到最前面
  const updatedCategories = [...displayCategories.value];
  const index = updatedCategories.indexOf(category);

  if (index > 0) {
    // 只有当类别不在第一位时才需要调整
    updatedCategories.splice(index, 1);
    updatedCategories.unshift(category);
    displayCategories.value = updatedCategories;

    // 确保该类别的工具已加载
    if (!toolsStore.loadedCategories.has(category)) {
      loadCategoryTools(category);
    }
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
          authStore.user.username
        );
        authStore.user.token = data.Authorization;
        localStorage.setItem("user", JSON.stringify(authStore.user));
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
  if (authStore.isFresh == 1) {
    passwordDialogVisible.value = true;
  }

  // 2. 加载工具列表
  initialLoading.value = true;
  loading.value = true;

  await toolsStore.fetchCategory();
  const storedActive = localStorage.getItem("activeName");
  activeName.value = storedActive ? JSON.parse(storedActive) : "AI对话工具";

  // 保存原始分类顺序
  originalCategoryOrder.value = [...toolsStore.categories];
  // 初始化显示顺序为原始顺序
  displayCategories.value = [...toolsStore.categories];

  // 首屏加载完成
  initialLoading.value = false;

  // 确保选中类别的工具被加载
  if (toolsStore.categories.includes(activeName.value)) {
    await loadCategoryTools(activeName.value);
  }

  // 为所有已加载的分类初始化工具
  loadedCategories.value.forEach((category) => {
    loadInitialTools(category);
  });

  loading.value = false;

  // 添加滚动监听
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", handleScroll);
    scrollContainer.value.setAttribute("data-scroll-listener", "true");
  }

  // 如果有存储的激活类别，把它放到最前面
  if (toolsStore.categories.includes(activeName.value)) {
    const updatedCategories = [...displayCategories.value];
    const index = updatedCategories.indexOf(activeName.value);
    if (index > 0) {
      updatedCategories.splice(index, 1);
      updatedCategories.unshift(activeName.value);
      displayCategories.value = updatedCategories;
    }
  }
  console.log(toolsStore.toolsByCategory);
});

// 获取已加载的类别
const loadedCategories = computed(() => {
  return toolsStore.categories.filter((category) =>
    toolsStore.loadedCategories.has(category)
  );
});

// 可见的分类列表
const batchSize = 8; // 每批加载的工具数量
const scrollContainer = ref<HTMLElement | null>(null);

// 工具数据比较和缓存相关
const visibleToolsCache = ref<Record<string, any[]>>({});

// 生成工具列表的指纹（只基于ratingCount）
const generateToolsFingerprint = (tools: any[]): string => {
  return tools.map((tool) => `${tool.id}-${tool.ratingCount || 0}`).join("|");
};

// 为可见的分类加载工具初始批次
const loadInitialTools = (category: string) => {
  if (!toolsStore.toolsByCategory[category]) return;

  const tools = toolsStore.toolsByCategory[category];
  if (!tools || tools.length === 0) return;

  // 检查该分类是否已经有工具加载
  if (visibleToolsPerCategory.value[category]?.length > 0) {
    // 检查数据是否发生变化（只比较ratingCount）
    const currentFingerprint = generateToolsFingerprint(
      visibleToolsPerCategory.value[category]
    );
    const newFingerprint = generateToolsFingerprint(tools);

    if (currentFingerprint === newFingerprint) {
      console.log(`[${category}] 数据未变化，跳过渲染`);
      return; // 数据未变化，不需要重新渲染
    }
    console.log(`[${category}] 数据已变化，重新渲染`);
  }

  // 只加载前batchSize个工具
  const initialTools = tools.slice(0, batchSize);
  visibleToolsPerCategory.value = {
    ...visibleToolsPerCategory.value,
    [category]: initialTools,
  };

  // 更新缓存
  visibleToolsCache.value[category] = [...initialTools];
};

// 手动加载更多工具
const loadMoreTools = (category: string) => {
  const allTools = toolsStore.toolsByCategory[category] || [];
  const currentVisible = visibleToolsPerCategory.value[category] || [];

  if (currentVisible.length < allTools.length) {
    const nextBatchStartIndex = currentVisible.length;
    const nextBatchEndIndex = Math.min(
      currentVisible.length + batchSize,
      allTools.length
    );
    const nextBatch = allTools.slice(nextBatchStartIndex, nextBatchEndIndex);

    // 更新可见工具列表
    visibleToolsPerCategory.value = {
      ...visibleToolsPerCategory.value,
      [category]: [...currentVisible, ...nextBatch],
    };

    // 更新缓存
    visibleToolsCache.value[category] = [
      ...visibleToolsPerCategory.value[category],
    ];

    console.log(
      `[${category}] 加载更多: ${nextBatchStartIndex} -> ${nextBatchEndIndex}`
    );
  }
};

// 处理滚动事件，实现懒加载更多工具
const handleScroll = () => {
  if (!scrollContainer.value) return;

  const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value;

  // 更新导航栏激活状态
  updateActiveCategory(scrollTop);
};

// 根据滚动位置更新当前激活的分类
const updateActiveCategory = (scrollTop: number) => {
  if (!scrollContainer.value) return;

  const categoryElements = document.querySelectorAll(".category-section");
  const offset = 150;
  const containerTop = scrollContainer.value.getBoundingClientRect().top;

  // 找到当前视口中的分类
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

// 监听工具数据变化
watch(
  () => toolsStore.toolsByCategory,
  (newValue, oldValue) => {
    // 检查工具数据是否发生变化
    for (const category in newValue) {
      if (newValue[category]?.length) {
        const newFingerprint = generateToolsFingerprint(newValue[category]);
        const oldFingerprint = generateToolsFingerprint(
          oldValue?.[category] || []
        );

        if (newFingerprint !== oldFingerprint) {
          console.log(`[${category}] 监听器检测到数据变化，重新加载`);
          loadInitialTools(category);
        } else {
          console.log(`[${category}] 监听器检测到数据未变化，跳过加载`);
        }
      }
    }
  },
  { deep: true }
);

// 重置分类顺序
const resetCategoryOrder = () => {
  displayCategories.value = [...originalCategoryOrder.value];
  activeName.value = originalCategoryOrder.value[0] || "对话模型";
  localStorage.setItem("activeName", JSON.stringify(activeName.value));
};

// 加载指定类别的工具
const loadCategoryTools = async (category: string) => {
  if (toolsStore.loadedCategories.has(category)) return;

  try {
    await toolsStore.loadToolsForCategories([category]);
    loadInitialTools(category);
  } catch (error) {
    ElMessage.error(`加载 ${category} 失败，请稍后重试`);
  }
};

// 使用 computed 优化频繁计算
const toolsCount = computed(
  () => Object.values(toolsStore.toolsByCategory || {}).flat().length
);
const categoriesCount = computed(
  () => Object.values(toolsStore.toolsByCategory || {}).length
);
const ratesCount = computed(() =>
  Object.values(toolsStore.toolsByCategory || {})
    .flat()
    .reduce((sum, tool) => sum + tool.ratingCount, 0)
);

// 使用 shallowRef 优化大数据结构的响应式
const visibleToolsPerCategory = shallowRef<Record<string, any[]>>({});

const stats = shallowRef({
  toolsCount: 0,
  categoriesCount: 0,
  ratesCount: 0,
});

const updateStats = () => {
  const tools = Object.values(toolsStore.toolsByCategory || {}).flat();
  stats.value = {
    toolsCount: tools.length,
    categoriesCount: Object.keys(toolsStore.toolsByCategory || {}).length,
    ratesCount: tools.reduce((sum, tool) => sum + (tool.ratingCount || 0), 0),
  };
};

watch(
  () => toolsStore.toolsByCategory,
  () => {
    updateStats();
  },
  { deep: true }
);

onMounted(() => {
  updateStats();
});
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
            <el-autocomplete
              v-model="searchText"
              :fetch-suggestions="querySearchAsync"
              placeholder="搜索工具名称、描述或分类..."
              @select="handleSearchSelect"
              clearable
              @clear="clearSearch"
              class="search-input"
              popper-class="search-popper"
              :trigger-on-focus="false"
            >
              <template #prefix>
                <el-icon class="search-icon"><Search /></el-icon>
              </template>
              <template #default="{ item }">
                <div class="search-result-item">
                  <div class="search-result-logo-container">
                    <img
                      :src="item.logo_url"
                      :alt="item.name"
                      class="search-result-logo"
                    />
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
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="22"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                  ></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h6"></path>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-count">
                  {{ stats.toolsCount }}
                </div>
                <div class="stat-label">AI工具总数</div>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
                  ></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-count">{{ stats.categoriesCount }}</div>
                <div class="stat-label">分类数量</div>
              </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  ></path>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-count">{{ stats.ratesCount }}</div>
                <div class="stat-label">评价数量</div>
              </div>
            </div>
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
              <template
                v-for="category in toolsStore.categories"
                :key="category"
              >
                <div
                  :class="[
                    'category-nav-item',
                    activeName === category ? 'active' : '',
                  ]"
                  @click.stop="handleSelect(category)"
                >
                  {{ category }}
                </div>
              </template>

              <div
                class="category-nav-item reset"
                @click.stop="resetCategoryOrder"
                title="恢复默认顺序"
              >
                <el-icon><Refresh /></el-icon> 恢复默认
              </div>
            </div>
          </div>
          <div
            v-for="category in displayCategories"
            :key="category"
            class="category-section"
          >
            <div class="category-header" :id="category">
              <h2 class="category-title">{{ category }}</h2>
              <div class="category-count">
                {{ toolsStore.toolsByCategory[category]?.length || 0 }} 个工具
              </div>
            </div>

            <template v-if="!toolsStore.loadedCategories.has(category)">
              <div class="loading-category">
                <div class="loading-spinner">
                  <div class="spinner-circle"></div>
                  <div class="spinner-progress">
                    {{
                      Math.round(
                        (toolsStore.loadedToolsCount /
                          toolsStore.totalToolsCount) *
                          100
                      )
                    }}%
                  </div>
                </div>
                <div class="loading-text">正在加载 {{ category }} 分类...</div>
                <div class="loading-details">
                  <div class="loading-progress">
                    <span>{{ toolsStore.loadedToolsCount }}</span>
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{
                          width: `${
                            (toolsStore.loadedToolsCount /
                              toolsStore.totalToolsCount) *
                            100
                          }%`,
                        }"
                      ></div>
                    </div>
                    <span>{{ toolsStore.totalToolsCount }}</span>
                  </div>
                  <div>
                    已加载 {{ toolsStore.loadedToolsCount }} /
                    {{ toolsStore.totalToolsCount }} 个工具
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="tools-grid">
                <Card
                  v-for="(tool, index) in visibleToolsPerCategory[category]"
                  :key="tool.id"
                  class="tool-card"
                  :style="{ '--index': index % 8 }"
                  @click="gotoDetail(tool)"
                >
                  <template #header>
                    <div class="tool-logo">
                      <img
                        :src="tool.logo_url"
                        :alt="tool.name"
                        :title="tool.name"
                      />
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
                          ⭐
                        </span>
                        <div class="rating-count">
                          已有
                          {{ tool.ratingCount ?? 0 }}
                          人评分
                        </div>
                      </div>
                    </div>
                  </template>
                </Card>

                <div
                  v-if="
                    visibleToolsPerCategory[category]?.length <
                    (toolsStore.toolsByCategory[category]?.length || 0)
                  "
                  class="load-more"
                  @click.stop="loadMoreTools(category)"
                >
                  <span>加载更多</span>
                  <el-icon class="load-more-icon">
                    <component :is="Arrow" />
                  </el-icon>
                </div>
              </div>
            </template>
          </div>
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

  <el-dialog
    v-model="passwordDialogVisible"
    title="首次登陆强制修改密码"
    width="400px"
    center
    destroy-on-close
    append-to-body
    :modal-append-to-body="true"
    class="password-dialog"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form
      :model="passwordForm"
      :rules="passwordRules"
      ref="passwordFormRef"
      label-width="100px"
      status-icon
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model="passwordForm.oldPassword"
          type="password"
          show-password
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          show-password
          placeholder="请确认新密码"
        />
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
