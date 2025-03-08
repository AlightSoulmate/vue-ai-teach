// @/stores/useToolsStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { getCategories, getTools } from "@/services/ToolsService";

export const useToolsStore = defineStore("tools", () => {
  const categories = ref<string[]>([]);
  const toolsByCategory = ref<Record<string, Tool[]>>({}); // 组装出的按类别分组的工具列表
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
  // 获取类别
  const fetchCategory = async () => {
    try {
      const data = await getCategories();
      categories.value = data.categories;
      loadTools();
    } catch {
      console.error("类别列表获取异常");
    }
  };

  // 获取工具数据并封装
  const loadTools = () => {
    // categories.value.forEach((category) => {
    //   toolsByCategory.value[category] = tools.value
    //     .filter((tool) => tool.category === category)
    //     .map((tool) => ({
    //       ...tool,
    //     }));
    // });
    categories.value.forEach(async (category) => {
      try {
        const resp = await getTools(category);
        console.log(resp.tools);
        toolsByCategory.value[category] = resp.tools.map(mapTool);
      } catch (e) {
        console.error(`获取 ${category} 工具失败:`, e);
      }
    });
    console.log(toolsByCategory.value);
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
    // tools,
    categories,
    toolsByCategory,
    fetchCategory,
    loadTools,
  };
});
// await axios
// .get(`https://frp-man.com:49044/tools?category=${category}`)
// .then((resp) => {

//   toolsByCategory.value[category] = resp.data.tools;
// })
// .catch((error) => {
//   console.error(`获取 ${category} 工具失败:`, error);
// });
