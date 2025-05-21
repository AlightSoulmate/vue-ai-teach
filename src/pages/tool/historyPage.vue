<template>
  <div class="page-container">
    <div class="forum-page">历史评价记录</div>
    <div v-if="historyRecords.length === 0" class="no-records">
      暂无历史评价记录。
    </div>
    <div v-else v-for="(record, index) in historyRecords" :key="index" class="record-item">
      <div class="record-date">
        {{ record.rate_time }} - 评分: {{ record.rating }} (工具ID: {{ record.tool_id }})
      </div>
      <div class="record-content">评论: {{ record.comment }}</div>
      <div class="record-user">用户昵称: {{ record.user }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'; 
//@ts-ignore
import { getHistoryRecords } from "@/services"; 
//@ts-ignore
import type { PersonalHistoryRecordsResponse, HistoryRecord } from "@/services"; 

const historyRecords = ref<HistoryRecord[]>([]);

// 获取历史评价数据
const fetchHistoryRecords = async () => {
  try {

    const res: PersonalHistoryRecordsResponse = await getHistoryRecords();

    
    if (res && Array.isArray(res.rates)) {
      historyRecords.value = res.rates;
    } else {
      console.error("后端返回的历史评价数据格式不正确", res);
      historyRecords.value = []; // Clear records if format is unexpected
    }
  } catch (error: Error | any) {
    console.error("获取历史记录时发生错误:", error);
    historyRecords.value = []; // Clear records on error
  }
};


onMounted(() => {
  fetchHistoryRecords();
});
</script>

<style scoped>
.page-container {
  /* Added for overall page structure, you might want to adjust its styles */
}

.forum-page {
  color: var(--text-color);
  margin: 11px 0 20px 45px;
  font-size: 20px;
  font-weight: 600;
}

.no-records {
  margin: 15px 45px;
  color: #666;
  font-style: italic;
}

.record-item {
  margin: 15px 45px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fdfdfd;
}

.record-date {
  color: #555;
  font-size: 14px;
  font-weight: bold;
}

.record-content {
  margin-top: 5px;
  font-size: 16px;
  color: #333;
}

.record-user {
  margin-top: 5px;
  font-size: 13px;
  color: #777;
}
</style>