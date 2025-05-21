<template>
  <div class="page-container">
    <div class="forum-page">历史评价记录</div>
    <div v-if="historyRecords.length === 0" class="no-records">
      暂无历史评价记录。
    </div>
    <div v-else v-for="(record, index) in historyRecords" :key="index" class="record-item">
      <div class="record-date">
        {{ record.rate_time }} - 评分: {{ record.rating }} ⭐ (工具ID: {{ record.tool_id }})
      </div>
      <div class="record-content">评论: {{ record.comment }}</div>
      <div class="record-user">用户昵称: {{ record.user }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'; 
import { getHistoryRecords } from "../../services/evaluationService"; 
import type { PersonalHistoryRecordsResponse, HistoryRecord } from "../../services/evaluationService"; 

const historyRecords = ref<HistoryRecord[]>([]);

// 模拟数据
const mockHistoryRecords: HistoryRecord[] = [
  {
    user: "张三",
    rating: 4.5,
    comment: "这个AI工具非常好用，回答准确且详细，推荐使用！",
    rate_time: "2024-03-15 14:30:25",
    tool_id: "chatgpt-4"
  },
  {
    user: "李四",
    rating: 5.0,
    comment: "界面简洁，功能强大，是我用过最好的AI助手之一。",
    rate_time: "2024-03-14 09:15:42",
    tool_id: "claude-3"
  },
  {
    user: "王五",
    rating: 3.8,
    comment: "整体不错，但有时候响应速度有点慢，希望可以优化。",
    rate_time: "2024-03-13 16:45:10",
    tool_id: "gemini-pro"
  },
  {
    user: "赵六",
    rating: 4.2,
    comment: "功能很全面，但学习曲线有点陡峭，建议添加更多使用教程。",
    rate_time: "2024-03-12 11:20:33",
    tool_id: "chatgpt-4"
  },
  {
    user: "钱七",
    rating: 4.7,
    comment: "非常智能，能够理解复杂的问题，给出专业的解答。",
    rate_time: "2024-03-11 15:50:18",
    tool_id: "claude-3"
  }
];

// 获取历史评价数据
const fetchHistoryRecords = async () => {
  try {
    // 使用模拟数据
    // const res: PersonalHistoryRecordsResponse = await getHistoryRecords();
    // if (res && Array.isArray(res.rates)) {
    //   historyRecords.value = res.rates;
    // } else {
    //   console.error("后端返回的历史评价数据格式不正确", res);
    //   historyRecords.value = []; 
    // }
    
    // 直接使用模拟数据
    historyRecords.value = mockHistoryRecords;
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
  } catch (error: Error | any) {
    console.error("获取历史记录时发生错误:", error);
    historyRecords.value = []; 
  }
};

onMounted(() => {
  fetchHistoryRecords();
});
</script>

<style scoped>
.page-container {
  /* Added for overall page structure, you might want to adjust its styles */
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fdfdfd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.record-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.record-date {
  color: #555;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.record-content {
  margin-top: 10px;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.record-user {
  margin-top: 10px;
  font-size: 13px;
  color: #777;
  font-style: italic;
}
</style>