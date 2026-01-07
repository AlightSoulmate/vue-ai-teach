<template>
  <div>
    <h1 class="title">作业记录</h1>
    <div class="eval-list">
      <div v-for="(item, index) in evalRecords" :key="index" class="eval-item">
        <span class="tool-id">工具ID: {{ item.toolid }}</span>
        <span class="datetime">时间: {{ item.datetime }}</span>
        <button class="content-btn">暂无法查看内容</button>
        <!-- <button class="content-btn" @click="handleContentClick(item)">查看评估结果</button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useFileStreamStore } from '@/stores/useFileStreamStore'

const fileStreamStore = useFileStreamStore()
interface EvalRecord {
  toolid: string
  datetime: string
  content: string
}

const evalRecords = ref<EvalRecord[]>([
  {
    toolid: 'tool001',
    datetime: '2025-06-06 10:00:00',
    content: '这是第一条作业内容'
  },
  {
    toolid: 'tool002',
    datetime: '2025-06-06 11:30:00',
    content: '这是第二条作业内容'
  }
])


let contents = ref<any>()
const handleContentClick = (record: EvalRecord) => {
  // 这里可以根据具体需求处理内容的显示
  // 比如打开一个弹窗或者跳转到详情页
  contents = JSON.parse(record.content);

  console.log('点击的内容:', record.content)
  alert(record.content)
}

const evalData = ref({
  basic_info: {
    basic_score: 0,
    object: 0,
    category: 0,
    using: 0,
    rationale: 0,
    basic_summary: ""
  },
  core_function: {
    core_score: 0,
    function: 0,
    effect_evaluation: 0,
    recommend: 0,
    core_summary: ""
  },
  user_experience: {
    experience_score: 0,
    operation_efficiency: 0,
    error_handling: 0,
    document_support: 0,
    user_summary: ""
  },
  practical_value: {
    practical_score: 0,
    cost_effectiveness: 0,
    scenario_adaptability: 0,
    practical_summary: ""
  },
  conclusion: {
    conclusion_score: 0,
    strength_weakness: 0,
    scenario: 0,
    conclusion_summary: ""
  },
  total_score: 0,
  summary: ""
})

const userInfo = ref({
  nickname: 'null',
  username: 'null',
  className: 'null'
})

// 下载处理函数
const handleDownload = async () => {
  if (!evalData.value) {
    ElMessage.warning('暂无可下载的评估数据')
    return
  }
  let user = JSON.parse(localStorage.getItem('user') || '{}')

  userInfo.value = {
    nickname: user.nickname || "未知",
    username: user.username || "未知",
    className: user.cno || "未知",
  }
  try {
    await fileStreamStore.downloadReport({
      userInfo: userInfo.value,
      evalData: evalData.value,
    })
    ElMessage.success('下载成功')
  } catch (error) {
    ElMessage.error('下载失败：' + error)
  }
}
</script>

<style scoped>
.title {
  color: var(--text-color);
  margin: 11px 0 20px 45px;
  font-size: 20px;
  font-weight: 600;
}

.eval-list {
  padding: 0 45px;
}

.eval-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  gap: 20px;
}

.tool-id {
  min-width: 150px;
}

.datetime {
  min-width: 200px;
}

.content-btn {
  padding: 5px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.content-btn:hover {
  background-color: #45a049;
}
</style>
