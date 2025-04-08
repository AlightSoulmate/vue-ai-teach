<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  computed,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToolsStore } from "@/stores/useToolsStore";
import { useSelectedToolStore } from "@/stores/useSelectedToolStore";
import { change } from "@/services/AuthService";
import { ElMessage } from "element-plus";
import {
  Search,
  Monitor,
  ArrowDown as Arrow,
  Refresh,
} from "@element-plus/icons-vue";
import Card from "@/components/main/Card.vue";
import BackTop from "@/components/use/backTop.vue";
import Foot from "@/components/main/components/Foot.vue";
import type { FormInstance, FormRules } from "element-plus";

const route = useRouter();
const toolsStore = useToolsStore();
const selectToolStore = useSelectedToolStore();
const activeName = ref("AI对话工具");
const titleH1 = ref("AI / LLM 模型工具集");

const loading = ref(true);
const initialLoading = ref(true);
const authStore = useAuthStore();

// 搜索相关
const searchText = ref("");
const showSearchResults = ref(false);
const selectedTool = ref<any>(null);

// 搜索过滤器
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

// 搜索建议
let timeout: ReturnType<typeof setTimeout>;
const querySearchAsync = (
  queryString: string,
  callback: (arg: any) => void
) => {
  const allTools = Object.values(toolsStore.toolsByCategory || {}).flat();
  const results = queryString ? allTools.filter(createFilter(queryString)) : [];

  const formattedResults = results.map((tool) => ({
    value: tool.name,
    ...tool,
  }));

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    callback(formattedResults);
  }, 300);
};

// 处理工具选择
const handleSearchSelect = (item: any) => {
  selectedTool.value = item;
  searchText.value = item.name;
  showSearchResults.value = false;
  selectToolStore.selectTool(item);
  route.push("/detail");
};

// 清除搜索
const clearSearch = () => {
  searchText.value = "";
  selectedTool.value = null;
  showSearchResults.value = false;
};

const handleSearch = (query: string) => {
  searchText.value = query;
  showSearchResults.value = true;
};

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
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
      validator: (rule, value, callback) => {
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
        authStore.user.nickname = passwordForm.nickname;
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
        ElMessage.error("修改失败,请重试");
      }
    }
  });
};

// 添加导航栏显示模式
const navDisplayMode = ref<"grid" | "scroll">("grid");

const toggleNavDisplayMode = () => {
  navDisplayMode.value = navDisplayMode.value === "grid" ? "scroll" : "grid";
  localStorage.setItem("navDisplayMode", navDisplayMode.value);
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
  activeName.value = storedActive ? JSON.parse(storedActive) : "对话模型";

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

  // 初始化打字机效果
  nextTick(() => {
    initTypewriter();
  });

  // 加载导航显示模式
  const savedNavMode = localStorage.getItem("navDisplayMode");
  if (savedNavMode && (savedNavMode === "grid" || savedNavMode === "scroll")) {
    navDisplayMode.value = savedNavMode as "grid" | "scroll";
  }
});

const scrollToCategory = (category: string) => {
  // 查找目标元素
  const targetElement = document.getElementById(category);
  if (targetElement) {
    // 计算滚动位置（考虑导航栏的高度）
    const offset = 120; // 导航栏高度加上额外空间
    const containerTop =
      scrollContainer.value?.getBoundingClientRect().top || 0;
    const elementTop = targetElement.getBoundingClientRect().top - containerTop;

    // 平滑滚动
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: scrollContainer.value.scrollTop + elementTop - offset,
        behavior: "smooth",
      });
    }
  }
};

// 获取已加载的类别
const loadedCategories = computed(() => {
  return toolsStore.categories.filter((category) =>
    toolsStore.loadedCategories.has(category)
  );
});

// 可见的分类列表
// const visibleCategories = computed(() => loadedCategories.value);

const batchSize = 8; // 每批加载的工具数量
const visibleToolsPerCategory = ref<Record<string, any[]>>({});
const scrollContainer = ref<HTMLElement | null>(null);

// 工具数据比较和缓存相关
const toolsFingerprints = ref<Record<string, string>>({});
const visibleToolsCache = ref<Record<string, any[]>>({});
const lastUpdateTime = ref<Record<string, number>>({});

// 生成工具列表的指纹（只基于ratingCount）
const generateToolsFingerprint = (tools: any[]): string => {
  return tools.map((tool) => `${tool.id}-${tool.ratingCount || 0}`).join("|");
};

// 检查是否需要更新数据
const shouldUpdateData = (
  category: string,
  newFingerprint: string
): boolean => {
  const currentTime = Date.now();
  const lastUpdate = lastUpdateTime.value[category] || 0;
  const currentFingerprint = toolsFingerprints.value[category];

  // 如果数据指纹相同，且未超过缓存时间，则不更新
  if (
    currentFingerprint === newFingerprint &&
    currentTime - lastUpdate < 60000
  ) {
    return false;
  }

  // 更新指纹和最后更新时间
  toolsFingerprints.value[category] = newFingerprint;
  lastUpdateTime.value[category] = currentTime;
  return true;
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

    // 检查新加载的数据是否与现有数据有变化（只比较ratingCount）
    const currentFingerprint = generateToolsFingerprint(currentVisible);
    const newFingerprint = generateToolsFingerprint([
      ...currentVisible,
      ...nextBatch,
    ]);

    if (currentFingerprint !== newFingerprint) {
      console.log(`[${category}] 加载更多时数据已变化，更新视图`);
      visibleToolsPerCategory.value[category] = [
        ...currentVisible,
        ...nextBatch,
      ];
      visibleToolsCache.value[category] = [
        ...visibleToolsPerCategory.value[category],
      ];
    } else {
      console.log(`[${category}] 加载更多时数据未变化，跳过更新`);
    }
  }
};

// 处理滚动事件，实现懒加载更多工具
const handleScroll = () => {
  if (!scrollContainer.value) return;

  const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value;

  // 更新导航栏激活状态
  updateActiveCategory(scrollTop);

  // 当滚动到底部附近时，不自动加载更多工具，保留点击加载更多的模式
  // 移除自动加载更多的逻辑
};

// 根据滚动位置更新当前激活的分类
const updateActiveCategory = (scrollTop: number) => {
  if (!scrollContainer.value) return;

  const categoryElements = document.querySelectorAll(".category-section");
  const offset = 150; // 导航栏高度加上额外空间
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

// 清理工作
onBeforeUnmount(() => {
  if (
    scrollContainer.value &&
    scrollContainer.value.hasAttribute("data-scroll-listener")
  ) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
    scrollContainer.value.removeAttribute("data-scroll-listener");
  }
});

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
    // 使用正确的方法加载分类工具
    await toolsStore.loadToolsForCategories([category]);
    // 初始化显示的工具
    loadInitialTools(category);
  } catch (error) {
    console.error(`加载 ${category} 工具失败:`, error);
    ElMessage.error(`加载 ${category} 工具失败，请稍后重试`);
  }
};

// 平滑滚动到内容区域
const scrollToContent = () => {
  const navbar = document.getElementById("category-navbar");
  if (navbar && scrollContainer.value) {
    const navbarTop = navbar.getBoundingClientRect().top;
    const containerTop = scrollContainer.value.getBoundingClientRect().top;
    const offsetTop = navbarTop - containerTop - 20;

    scrollContainer.value.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
};

// 打字机效果
const initTypewriter = () => {
  const typewriterText = document.querySelector(".typewriter-text");
  if (!typewriterText) return;

  const dataText = typewriterText.getAttribute("data-text");
  if (!dataText) return;

  const texts = JSON.parse(dataText || "[]");
  if (!texts.length) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      if (typewriterText) {
        typewriterText.textContent = currentText.substring(0, charIndex - 1);
      }
      charIndex--;
      typingSpeed = 50;
    } else {
      if (typewriterText) {
        typewriterText.textContent = currentText.substring(0, charIndex + 1);
      }
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      // 完成打字，等待一段时间后开始删除
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      // 完成删除，切换到下一个文本
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
};
</script>

<template>
  <el-container v-loading="initialLoading">
    <div class="main-container" ref="scrollContainer">
      <div class="hero-section">
        <div class="hero-background">
          <div class="bg-gradient"></div>
          <div class="bg-pattern"></div>
          <div class="floating-icons">
            <div class="floating-icon icon-1">
              <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                ></path>
              </svg>
            </div>
            <div class="floating-icon icon-2">
              <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18M9 21V9"></path>
              </svg>
            </div>
            <div class="floating-icon icon-3">
              <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2v20M2 12h20"></path>
              </svg>
            </div>
            <div class="floating-icon icon-4">
              <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                ></polygon>
              </svg>
            </div>
          </div>
        </div>

        <div class="hero-content">
          <h1 class="hero-title">{{ titleH1 }}</h1>
          <div class="hero-subtitle">
            <span class="highlight">400+</span> AI / LLM 工具，发现最适合您的 >>
            <span class="typewriter">
              <span
                class="typewriter-text"
                data-text='["人工智能解决方案", "AI创作助手", "智能编程工具", "数据分析工具"]'
              ></span>
            </span>
          </div>

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

            <div class="search-tags">
              <div class="tags-header">热门工具:</div>
              <div class="tags-container">
                <el-tag
                  v-for="(tag, index) in [
                    'deepseek',
                    '美图设计室',
                    'AiPPT',
                    '秘塔写作猫',
                    '讯飞星火',
                  ]"
                  :key="tag"
                  size="small"
                  :type="
                    ['primary', 'success', 'warning', 'danger', 'info'][
                      index % 5
                    ]
                  "
                  effect="light"
                  @click="handleSearch(tag)"
                  class="hot-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>

          <div class="hero-stats">
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
                    d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                  ></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h6"></path>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-count">
                  {{
                    Object.values(toolsStore.toolsByCategory || {}).flat()
                      .length
                  }}
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
                <div class="stat-count">{{ toolsStore.categories.length }}</div>
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
                <div class="stat-count">
                  {{ Math.floor(Math.random() * 1000) + 2000 }}
                </div>
                <div class="stat-label">用户评价</div>
              </div>
            </div>
          </div>

          <div class="hero-action">
            <button class="action-button" @click="scrollToContent">
              <span>探索工具</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <el-main class="main">
        <template v-if="!initialLoading">
          <div
            :class="['category-navbar', `mode-${navDisplayMode}`]"
            id="category-navbar"
          >
            <div class="navbar-header">
              <h3 class="navbar-title">工具分类</h3>
              <div class="navbar-actions">
                <el-tooltip
                  :content="`切换到${
                    navDisplayMode === 'grid' ? '横向' : '网格'
                  }视图`"
                  placement="top"
                >
                  <div class="nav-display-toggle" @click="toggleNavDisplayMode">
                    <el-icon v-if="navDisplayMode === 'grid'"
                      ><Search
                    /></el-icon>
                    <el-icon v-else><Monitor /></el-icon>
                  </div>
                </el-tooltip>
              </div>
            </div>

            <el-scrollbar v-if="navDisplayMode === 'scroll'">
              <div class="category-nav-content scroll">
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
            </el-scrollbar>

            <div v-else class="category-nav-content grid">
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
                          {{
                            (
                              tool.score ?? Math.floor(Math.random() * 4) + 1
                            ).toFixed(1)
                          }}
                          ⭐
                        </span>
                        <div class="rating-count">
                          已有
                          {{
                            tool.ratingCount ?? Math.floor(Math.random() * 100)
                          }}
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
    title="修改密码和昵称"
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
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="passwordForm.nickname" placeholder="请输入昵称" />
      </el-form-item>
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
