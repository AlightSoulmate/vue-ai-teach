// @/stores/useSelectedToolStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";

export const useSelectedToolStore = defineStore("selectTool", () => {
  const selectedTool = ref<Tool[]>([]);
  interface Tool {
    id: number;
    name: string;
    logoUrl: string;
    url: string;
    description: string;
    score: number;
    ratingCount: number;
    category: string;
  }
  const selectTool = (tool: any) => {
    selectedTool.value = tool;
    // console.log(selectedTool.value);
    localStorage.setItem('selectedTool', JSON.stringify(selectedTool.value));
  };
  return { selectedTool,selectTool };
});
