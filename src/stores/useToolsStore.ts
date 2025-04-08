// @/stores/useToolsStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { getCategories, getTools } from "@/services";

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

export const useToolsStore = defineStore("tools", {
  state: () => ({
    categories: [] as string[],
    toolsByCategory: {} as Record<string, Tool[]>,
    isLoading: false,
    loadedCategories: new Set<string>(),
    loadedToolsCount: 0,
    totalToolsCount: 0,
    CACHE_TIME: 3 * 1000, // 缓存30s
  }),

  actions: {
    // 从缓存加载数据
    async loadFromCache() {
      const cachedCategories = localStorage.getItem("toolCategories");
      const cachedTools = localStorage.getItem("toolsByCategory");

      if (cachedCategories && cachedTools) {
        try {
          const parsedCategories = JSON.parse(cachedCategories);
          const parsedTools = JSON.parse(cachedTools);

          if (!parsedCategories?.length) return false;

          this.categories = parsedCategories;
          this.toolsByCategory = parsedTools;
          this.loadedCategories = new Set(parsedCategories);
          this.loadedToolsCount = Object.values(this.toolsByCategory).reduce(
            (total, tools) => total + tools.length,
            0
          );
          this.totalToolsCount = Object.values(this.toolsByCategory).reduce(
            (total, tools) => total + tools.length,
            0
          );
          return true;
        } catch (e) {
          console.error("缓存数据解析失败:", e);
        }
      }
      return false;
    },

    // 保存数据到缓存
    saveToCache() {
      try {
        if (this.categories.length > 0) {
          localStorage.setItem(
            "toolCategories",
            JSON.stringify(this.categories)
          );
          localStorage.setItem(
            "toolsByCategory",
            JSON.stringify(this.toolsByCategory)
          );
          localStorage.setItem("toolsCacheTime", Date.now().toString());
        }
      } catch (e) {
        console.error("保存缓存失败:", e);
      }
    },

    // 检查缓存是否过期
    isCacheExpired() {
      const cacheTime = localStorage.getItem("toolsCacheTime");
      return !cacheTime || Date.now() - parseInt(cacheTime) > this.CACHE_TIME;
    },

    // 加载指定类别的工具
    async loadToolsForCategories(
      categoriesToLoad: string[],
      isBackground = false
    ) {
      if (!isBackground) {
        this.isLoading = true;
      }

      try {
        for (const category of categoriesToLoad) {
          if (!this.loadedCategories.has(category)) {
            const response = await getTools(category);
            if (response?.tools) {
              this.toolsByCategory[category] = response.tools.map(this.mapTool);
              this.loadedCategories.add(category);
              this.loadedToolsCount += response.tools.length;
              this.totalToolsCount = Object.values(this.toolsByCategory).reduce(
                (total, tools) => total + tools.length,
                0
              );
              if (!isBackground) this.saveToCache();
            }
          }
        }
      } catch (error) {
        console.error("加载工具失败:", error);
        throw error;
      } finally {
        if (!isBackground) {
          this.isLoading = false;
        }
      }
    },

    // 加载首屏类别
    async loadInitialCategories() {
      if (!this.categories.length) return;
      await this.loadToolsForCategories(this.categories.slice(0, 2));
    },

    // 加载剩余类别
    async loadRemainingCategories() {
      if (!this.categories.length) return;
      await this.loadToolsForCategories(this.categories.slice(2), true);
      if (Object.keys(this.toolsByCategory).length === this.categories.length) {
        this.saveToCache();
      }
    },

    // 获取类别和工具数据
    async fetchCategory() {
      try {
        this.isLoading = true;

        if (!this.isCacheExpired() && (await this.loadFromCache())) {
          return;
        }

        const data = await getCategories();
        if (data?.categories) {
          this.categories = data.categories;
          await this.loadInitialCategories();
          await this.loadRemainingCategories();
        }
      } catch (e) {
        console.error("获取数据异常:", e);
        await this.loadFromCache(); // 失败时尝试使用缓存
      } finally {
        this.isLoading = false;
      }
    },

    // 数据映射
    mapTool(tool: any): Tool {
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
    },
  },
});
