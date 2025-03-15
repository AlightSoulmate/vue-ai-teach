// @/stores/useToolsStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { getCategories, getTools } from "@/services";
// import { tools } from "../../backup/tools";

export const useToolsStore = defineStore("tools", () => {
  const categories = ref<string[]>([]);
  const toolsByCategory = ref<Record<string, Tool[]>>({});
  const isLoading = ref(false);
  const loadedCategories = ref<Set<string>>(new Set());
  const CACHE_TIME = 10 * 60 * 1000; // 10分钟缓存

  interface Tool {
    id: number;
    name: string;
    logo_url: string;
    url: string;
    description: string;
    score: number;
    ratingCount: number;
    category: string;
  }

  // 从缓存加载数据
  const loadFromCache = async () => {
    const cachedCategories = localStorage.getItem("toolCategories");
    const cachedTools = localStorage.getItem("toolsByCategory");

    if (cachedCategories && cachedTools) {
      try {
        const parsedCategories = JSON.parse(cachedCategories);
        const parsedTools = JSON.parse(cachedTools);

        if (!parsedCategories?.length) return false;

        categories.value = parsedCategories;
        toolsByCategory.value = parsedTools;
        loadedCategories.value = new Set(parsedCategories);
        return true;
      } catch (e) {
        console.error("缓存数据解析失败:", e);
      }
    }
    return false;
  };

  // 保存数据到缓存
  const saveToCache = () => {
    try {
      if (categories.value.length > 0) {
        localStorage.setItem(
          "toolCategories",
          JSON.stringify(categories.value)
        );
        localStorage.setItem(
          "toolsByCategory",
          JSON.stringify(toolsByCategory.value)
        );
        localStorage.setItem("toolsCacheTime", Date.now().toString());
      }
    } catch (e) {
      console.error("保存缓存失败:", e);
    }
  };

  // 检查缓存是否过期
  const isCacheExpired = () => {
    const cacheTime = localStorage.getItem("toolsCacheTime");
    return !cacheTime || Date.now() - parseInt(cacheTime) > CACHE_TIME;
  };

  // 加载指定类别的工具
  const loadToolsForCategories = async (
    categoriesToLoad: string[],
    isBackground = false
  ) => {
    const batchSize = 3;
    for (let i = 0; i < categoriesToLoad.length; i += batchSize) {
      const batch = categoriesToLoad.slice(i, i + batchSize);
      const promises = batch.map(async (category) => {
        try {
          const resp = await getTools(category);
          if (resp?.tools) {
            toolsByCategory.value[category] = resp.tools.map(mapTool);
            loadedCategories.value.add(category);
            if (!isBackground) saveToCache();
          }
        } catch (e) {
          console.error(`获取 ${category} 工具失败:`, e);
          toolsByCategory.value[category] = [];
        }
      });
      await Promise.all(promises);
    }
  };

  // 加载首屏类别
  const loadInitialCategories = async () => {
    if (!categories.value.length) return;
    await loadToolsForCategories(categories.value.slice(0, 2));
  };

  // 加载剩余类别
  const loadRemainingCategories = async () => {
    if (!categories.value.length) return;
    await loadToolsForCategories(categories.value.slice(2), true);
    if (Object.keys(toolsByCategory.value).length === categories.value.length) {
      saveToCache();
    }
  };

  // 获取类别和工具数据
  const fetchCategory = async () => {
    try {
      isLoading.value = true;

      if (!isCacheExpired() && (await loadFromCache())) {
        return;
      }

      const data = await getCategories();
      if (data?.categories) {
        categories.value = data.categories;
        await loadInitialCategories();
        await loadRemainingCategories();
      }
    } catch (e) {
      console.error("获取数据异常:", e);
      await loadFromCache(); // 失败时尝试使用缓存
    } finally {
      isLoading.value = false;
    }
  };

  // 数据映射
  const mapTool = (tool: any): Tool => ({
    id: tool.id,
    name: tool.name,
    logo_url: tool.logo_url,
    url: tool.url,
    description: tool.description,
    score: tool.score,
    ratingCount: tool.ratingCount,
    category: tool.category,
  });

  return {
    categories,
    toolsByCategory,
    isLoading,
    loadedCategories,
    fetchCategory,
    loadToolsForCategories,
  };
});
