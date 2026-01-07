<template>
  <div class="inbox">
    <h1 class="title">收件箱</h1>
    <el-empty v-if="loading === false && inboxItems.length === 0" description="暂无作业" />
    <el-skeleton v-if="loading" :rows="4" animated />
    <div v-else class="list">
      <el-card v-for="item in inboxItems" :key="item.id" class="card" shadow="hover">
        <div class="row">
          <div class="left">
            <div class="title-line">
              <span class="name">{{ item.title }}</span>
              <el-tag :type="item.is_done ? 'success' : 'warning'" size="small">
                {{ item.is_done ? '已提交' : '待完成' }}
              </el-tag>
            </div>
            <div class="meta">
              <span>发布时间：{{ item.push_date || '-' }}</span>
              <span v-if="item.end_date">截止时间：{{ item.end_date }}</span>
              <span v-if="item.commit_data?.commit_date">提交时间：{{ item.commit_data.commit_date }}</span>
              <span v-if="item.commit_data?.is_reviewed">已评分：{{ item.commit_data.score ?? '-' }}</span>
            </div>
            <div v-if="item.commit_data?.result" class="result-preview">
              <span class="result-label">AI评价：</span>
              <span class="result-text">{{ truncateResult(item.commit_data.result) }}</span>
            </div>
          </div>
          <div class="right">
            <el-upload
              v-if="!item.is_done"
              :show-file-list="false"
              :auto-upload="true"
              :http-request="(req:any)=>onUpload(item, req)"
              :accept="'.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.7z'"
            >
              <el-button size="small" type="primary" :loading="uploadingMap[item.homework_id]">提交作业</el-button>
            </el-upload>
            <el-button size="small" type="primary" plain @click="viewDetail(item)" style="margin-left: 8px;">详情</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog v-model="detailVisible" title="作业详情" width="600px">
      <div v-if="currentItem" class="detail">
        <div class="detail-header">
          <span class="detail-title">{{ currentItem.title }}</span>
          <el-tag :type="currentItem.is_done ? 'success' : 'warning'" size="small">
            {{ currentItem.is_done ? '已提交' : '待完成' }}
          </el-tag>
          <el-tag v-if="currentItem.commit_data?.is_reviewed" type="success" size="small" effect="plain" style="margin-left:6px;">已评阅</el-tag>
        </div>

        <el-descriptions :column="2" border size="small" class="detail-descriptions">
          <el-descriptions-item label="发布时间">{{ currentItem.push_date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="截止时间">{{ currentItem.end_date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ currentItem.commit_data?.commit_date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="评分">
            <template v-if="currentItem.commit_data?.is_reviewed">
              {{ currentItem.commit_data?.score ?? '-' }}
            </template>
            <template v-else>-</template>
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="currentItem.commit_data?.result" class="result-section">
          <h3>AI评价结果</h3>
          <div class="result-content markdown-body" v-html="renderMarkdown(currentItem.commit_data.result)"></div>
        </div>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <el-upload
            v-if="currentItem && !currentItem.commit_data?.is_reviewed"
            :show-file-list="false"
            :auto-upload="true"
            :http-request="(req:any)=>onUpload(currentItem!, req)"
            :accept="'.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.7z'"
          >
            <el-button type="primary" :loading="currentItem && uploadingMap[currentItem.homework_id]">
              {{ currentItem.is_done ? '重新提交' : '提交作业' }}
            </el-button>
          </el-upload>
          <span v-else-if="currentItem?.commit_data?.is_reviewed" style="color: #67C23A; font-size: 14px;">
            ✓ 作业已评阅，无法重新提交
          </span>
          <el-button @click="detailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getInbox, submitHomework } from '@/services'
import MarkdownIt from 'markdown-it'

// 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

interface InboxCommitData {
  commit_date?: string
  is_reviewed?: boolean
  score?: number
  result?: string
}

interface InboxItem {
  id: number
  homework_id: number
  title: string
  push_date: string
  end_date?: string  // 添加截止日期字段
  is_done: boolean
  commit_data?: InboxCommitData
}

const loading = ref<boolean>(true)
const inboxItems = ref<InboxItem[]>([])
const detailVisible = ref<boolean>(false)
const currentItem = ref<InboxItem | null>(null)
const uploadingMap = ref<Record<number, boolean>>({})

const fetchInbox = async () => {
  try {
    const stored = localStorage.getItem('user')
    const token = stored ? (JSON.parse(stored).token || '') : ''
    if (!token) {
      ElMessage.error('登录已失效，请重新登录')
      return
    }
    const data = await getInbox(token)
    const list = data?.homework || []
    console.log('📥 收件箱原始数据:', list)
    inboxItems.value = Array.isArray(list) ? list : []
    console.log('📤 处理后的数据:', inboxItems.value)
  } catch (e: any) {
    ElMessage.error(e?.message || '获取收件箱失败')
  } finally {
    loading.value = false
  }
}

const viewDetail = (item: InboxItem) => {
  console.log('🔍 查看详情 - 当前项:', item)
  console.log('  push_date:', item.push_date)
  console.log('  end_date:', item.end_date)
  console.log('  commit_data:', item.commit_data)
  currentItem.value = item
  detailVisible.value = true
}

const truncateResult = (text: string, maxLength: number = 100): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 渲染 Markdown 为 HTML
const renderMarkdown = (text: string): string => {
  if (!text) return ''
  try {
    return md.render(text)
  } catch (error) {
    console.error('Markdown 解析失败:', error)
    return text
  }
}

const onUpload = async (item: InboxItem, req: { file: File }) => {
  const stored = localStorage.getItem('user')
  const token = stored ? (JSON.parse(stored).token || '') : ''
  if (!token) {
    ElMessage.error('登录已失效，请重新登录')
    return
  }
  if (!req?.file) {
    ElMessage.warning('请选择文件')
    return
  }
  try {
    uploadingMap.value[item.homework_id] = true
    await submitHomework(token, item.homework_id, req.file)
    ElMessage.success('上传成功')
    await fetchInbox()
  } catch (e:any) {
    ElMessage.error(e?.message || '上传失败')
  } finally {
    uploadingMap.value[item.homework_id] = false
  }
}

onMounted(fetchInbox)
</script>

<style scoped>
.inbox {
  padding: 16px 24px;
}
.title {
  color: var(--text-color);
  margin: 11px 0 16px 6px;
  font-size: 20px;
  font-weight: 600;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  border-radius: 8px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.title-line {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
}
.meta {
  display: flex;
  gap: 18px;
  color: var(--text-secondary-color, #888);
}

.detail {
  padding: 4px 2px 0 2px;
}
.detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.detail-descriptions {
  margin-top: 6px;
}
.result-preview {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}
.result-label {
  font-weight: 500;
  color: #333;
}
.result-text {
  flex: 1;
  word-break: break-word;
  line-height: 1.4;
}
.result-section {
  margin-top: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.result-section h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.result-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

/* Markdown 样式 */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
  white-space: normal;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 12px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #303133;
}

.markdown-body h1 { font-size: 18px; }
.markdown-body h2 { font-size: 16px; }
.markdown-body h3 { font-size: 14px; }
.markdown-body h4 { font-size: 13px; }
.markdown-body h5 { font-size: 12px; }
.markdown-body h6 { font-size: 11px; }

.markdown-body p {
  margin: 8px 0;
}

.markdown-body ul,
.markdown-body ol {
  margin: 8px 0;
  padding-left: 24px;
}

.markdown-body li {
  margin: 4px 0;
}

.markdown-body code {
  background-color: #f5f7fa;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  color: #e6222d;
}

.markdown-body pre {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 12px;
  overflow-x: auto;
  margin: 8px 0;
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
  color: #606266;
}

.markdown-body blockquote {
  border-left: 4px solid #dcdfe6;
  padding-left: 12px;
  margin: 8px 0;
  color: #909399;
}

.markdown-body a {
  color: #409eff;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.markdown-body table th,
.markdown-body table td {
  border: 1px solid #dcdfe6;
  padding: 8px;
  text-align: left;
}

.markdown-body table th {
  background-color: #f5f7fa;
  font-weight: 600;
}

.markdown-body hr {
  border: none;
  border-top: 1px solid #dcdfe6;
  margin: 12px 0;
}
</style>


