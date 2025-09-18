<template>
  <div class="forum-page">我的历史评价记录</div>
  <div class="container-rates">
    <el-table :data="scoreStore.historyRates" style="width: 100%" highlight-current-row stripe>
      <el-table-column prop="id" label="评论id" width="80" />
      <el-table-column prop="tool_id" label="工具id" width="80" />
      <el-table-column prop="tool_name" label="工具名称" width="110" />
      <el-table-column prop="tool_category" label="工具分类" width="100" />
      <el-table-column prop="rating" label="评分" width="65" />
      <el-table-column prop="comment" label="评论内容" width="290" />
      <el-table-column prop="rate_time" label="评价时间" width="200" />
      <!-- 撤回评论 -->
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="danger" size="small" @click="scoreStore.deleteRate(scope.row.id)">撤回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useScoreStore } from "@/stores/useScoreStore";

const scoreStore = useScoreStore();
const getScoreList = async () => {
  await scoreStore.fetchHistoryRates();
};
onMounted(() => {
  setTimeout(() => {
    getScoreList();
  }, 300);
});
</script>

<style scoped>
.forum-page {
  color: var(--text-color);
  margin: 11px 0 20px 45px;
  font-size: 20px;
  font-weight: 600;
}

.container-rates {
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 20px;
}

/* 表格样式自定义 */
:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-fill-color-light);
  border-radius: 8px;
  overflow: hidden;
}

/* 表头居中显示 */
:deep(.el-table__header-wrapper) {
  th {
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-primary);
    font-weight: 600;
    height: 50px;
    text-align: center;
    /* 表头文字居中 */
  }
}

/* 表格内容居中显示 */
:deep(.el-table__row) {
  td {
    padding: 12px 0;
    text-align: center;
    /* 单元格文字居中 */
  }
}

:deep(.el-table__row) {
  td {
    padding: 12px 0;
  }
}

/* 评分列样式 - 修改为第四列 */
:deep(.el-table__row td:nth-child(4)) {
  font-weight: 600;
  color: var(--el-color-primary);
}

/* 为评分列添加额外的强调效果 */
:deep(.el-table__row) td:nth-child(4) {
  position: relative;
}

:deep(.el-table__row) td:nth-child(4)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background-color: var(--el-color-primary);
  opacity: 0;
  transition: opacity 0.3s;
}

:deep(.el-table__row:hover) td:nth-child(4)::after {
  opacity: 1;
}

/* 鼠标悬浮效果 */
:deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-lighter) !important;
  transition: background-color 0.3s ease;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .container-rates {
    margin: 0 10px;
    padding: 10px;
  }

  .forum-page {
    margin: 10px 0 15px 20px;
    font-size: 18px;
  }
}
</style>
