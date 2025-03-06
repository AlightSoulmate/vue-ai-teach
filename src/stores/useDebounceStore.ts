import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDebounceStore = defineStore("debounce", () => {
  const isSubmitting = ref(false);
  const lastSubmitDates = ref<Record<string, string>>({});

  // 原有的防抖功能
  const debounce = (fn: Function, delay: number = 500) => {
    let timer: number | null = null;
    return function(...args: any[]) {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        fn.apply(null, args);
        timer = null;
      }, delay);
    };
  };

  // 原有的提交锁定功能
  const withSubmitLock = async (fn: Function, lockTime: number = 3000) => {
    if (isSubmitting.value) return;
    
    isSubmitting.value = true;
    await fn();
    
    setTimeout(() => {
      isSubmitting.value = false;
    }, lockTime);
  };

  // 新增：每日提交限制功能
  const dailySubmitManager = {
    // 检查今天是否已提交
    checkDailySubmit(toolId: string | number): boolean {
      const key = `dailySubmit_${toolId}`;
      const lastSubmit = localStorage.getItem(key);
      
      if (lastSubmit) {
        const today = new Date().toISOString().split('T')[0];
        return lastSubmit === today;
      }
      return false;
    },

    // 记录提交
    recordSubmit(toolId: string | number): void {
      const key = `dailySubmit_${toolId}`;
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(key, today);
    },

    // 获取上次提交日期
    getLastSubmitDate(toolId: string | number): string {
      const key = `dailySubmit_${toolId}`;
      return localStorage.getItem(key) || '';
    }
  };

  return {
    isSubmitting,
    debounce,
    withSubmitLock,
    dailySubmitManager
  };
});