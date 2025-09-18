// @/stores/useToolsStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getCategories, getTools } from "@/services";
import { ElMessage } from "element-plus";

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

export const useToolsStore = defineStore('tools', () => {
  const categories = ref<string[]>([]);
  const currentCategoryTools = ref<Tool[]>([]);
  const isLoading = ref(false);
  const loadedCategory = ref("");
  const loadedToolsCount = ref(0);

  const loadCategoryTools = async (category: string) => {
    if (!categories.value.length) return;
    isLoading.value = true;
    try {
      const response = await getTools(category);
      if (response?.tools) {
        localStorage.setItem("activeName", JSON.stringify(category));
        currentCategoryTools.value = response.tools.map(mapTool);
        loadedCategory.value = category;
        loadedToolsCount.value = response.tools.length;
      }
    } catch (error) {
      ElMessage.error("工具数据获取异常");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategory = async () => {
    try {
      isLoading.value = true;
      const data = await getCategories();
      if (data?.categories) {
        categories.value = data.categories;
        loadedCategory.value = JSON.parse(localStorage.getItem("activeName") || '""');
        if (!loadedCategory.value) {
          loadedCategory.value = categories.value[0];
          localStorage.setItem("activeName", categories.value[0]);
        }
        await loadCategoryTools(loadedCategory.value);
      }
    } catch (e) {
      ElMessage.error("数据获取异常");
    } finally {
      isLoading.value = false;
    }
  };

  const mapTool = (tool: any): Tool => {
    return {
      id: tool.id,
      name: tool.name,
      logo_url: tool.logo_url,
      url: tool.url,
      description: tool.description,
      score: tool.score,
      ratingCount: tool.ratingCount,
      category: tool.category,
    };
  };

  const currentTools = computed(() => currentCategoryTools.value);

  return {
    categories,
    currentTools,
    isLoading,
    loadedCategory,
    loadedToolsCount,
    currentCategoryTools,
    loadCategoryTools,
    fetchCategory,
  };
});
