<template>
  <div class="assignments-page">
    <div class="header">
      <h2>作业管理</h2>
      <el-button type="primary" @click="openCreate">发布作业</el-button>
    </div>

    <!-- 课程选择下拉框 -->
    <div class="course-selector">
      <span class="label">选择课程：</span>
      <el-select 
        v-model="selectedCourseId" 
        placeholder="请选择课程" 
        @change="handleCourseChange"
        style="width: 300px"
      >
        <el-option 
          v-for="course in teacherStore.courseList" 
          :key="course.id" 
          :label="course.course" 
          :value="course.id" 
        />
      </el-select>
      <el-button 
        type="primary" 
        :icon="Refresh" 
        @click="refresh" 
        :loading="loading"
        style="margin-left: 12px"
      >
        刷新
      </el-button>
    </div>

    <!-- 作业列表 - 卡片布局 -->
    <div v-loading="loading" class="homework-list">
      <el-empty v-if="!filteredHomeworks.length" description="暂无作业" />
      
      <div v-else class="cards-container">
        <el-card 
          v-for="homework in filteredHomeworks" 
          :key="homework.homework_id"
          class="homework-card"
          shadow="hover"
          @click="viewSubmissions(homework)"
        >
          <template #header>
            <div class="card-header">
              <span class="homework-title">{{ homework.title }}</span>
              <el-tag 
                :type="isFullyReviewed(homework) ? 'success' : 'warning'"
                size="small"
              >
                {{ isFullyReviewed(homework) ? '已批改' : '未批改' }}
              </el-tag>
            </div>
          </template>
          
          <div class="card-content">
            <p class="description">{{ homework.description }}</p>
            
            <div class="info-row">
              <el-icon><Calendar /></el-icon>
              <span>发布时间：{{ homework.push_date }}</span>
            </div>
            
            <div class="info-row">
              <el-icon><Clock /></el-icon>
              <span>截止时间：{{ homework.end_date }}</span>
            </div>
            
            <div class="info-row">
              <el-icon><Document /></el-icon>
              <span>提交情况：{{ homework.submit_count }} / {{ homework.student_count }}</span>
            </div>
            
            <el-progress 
              :percentage="getSubmitPercentage(homework)" 
              :color="getProgressColor(homework)"
              :stroke-width="8"
              style="margin-top: 12px"
            />
          </div>
        </el-card>
      </div>
    </div>

    <!-- 发布作业对话框 -->
    <el-dialog v-model="dialogVisible" title="发布作业" width="560px">
      <el-form :model="form" label-width="96px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入作业标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="3" v-model="form.description" placeholder="请输入作业描述" />
        </el-form-item>
        <el-form-item label="所属课程">
          <el-select v-model="form.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option v-for="item in teacherStore.courseList" :key="item.id" :label="item.course" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="form.endDate" type="datetime" placeholder="选择日期时间" style="width: 100%" format="YYYY-MM-DD HH:mm:ss"/>
        </el-form-item>
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          multiple
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">将文件拖到此处，或<em>点击上传</em></el-button>
          <template #tip>
            <div class="el-upload__tip">
              docx / pdf files with a size less than 2MB.
            </div>
          </template>
        </el-upload>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">发布</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 提交详情对话框 -->
    <el-dialog v-model="subDialogVisible" title="提交详情" width="920px" @close="handleDialogClose">
      <div v-loading="subLoading">
        <template v-if="!students.length">
          <el-empty description="暂无提交记录" />
        </template>
        <template v-else>
          <!-- 批量批改工具栏 -->
          <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="color: #606266; font-size: 14px;">
                已选择 {{ selectedStudents.length }} 项
              </span>
              <el-button 
                v-if="selectedStudents.length > 0"
                size="small"
                @click="clearSelection"
              >
                清空选择
              </el-button>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <el-button 
                  type="primary"
                  :loading="aiGradingStore.isBatchRunning"
                  :disabled="aiGradingStore.isBatchRunning"
                  @click="handleBatchAIReview"
                >
                  {{ aiGradingStore.isBatchRunning ? '批改中...' : '批量AI批改' }}
                </el-button>
              <div v-if="aiGradingStore.batchTask" style="display: flex; align-items: center; gap: 8px;">
                <el-icon class="is-loading" style="animation: rotating 2s linear infinite;">
                  <Loading />
                </el-icon>
                <span style="color: #409eff; font-size: 14px;">{{ aiGradingStore.batchTask.message }}</span>
              </div>
            </div>
          </div>
          <el-table 
            :data="students" 
            stripe
            @selection-change="handleSelectionChange"
            ref="tableRef"
          >
            <el-table-column type="selection" width="55" :selectable="isRowSelectable" />
          <el-table-column prop="nickname" label="姓名" width="120" />
          <el-table-column prop="username" label="学号" width="140" />
          <el-table-column prop="class_name" label="班级" width="150" />
          <el-table-column label="是否提交" width="100">
            <template #default="{ row }">
              <el-tag :type="row.is_done ? 'success' : 'info'">{{ row.is_done ? '已提交' : '未提交' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否批改" width="100">
            <template #default="{ row }">
              <el-tag :type="row.is_reviewed ? 'success' : 'warning'">{{ row.is_reviewed ? '已批改' : '未批改' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="分数" width="80" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div v-if="row.is_done && row.submit_record_id" style="display: flex; align-items: center; gap: 8px;">
                <el-button
                  size="small"
                  :type="row.is_reviewed ? 'warning' : 'primary'"
                  :loading="isSingleTaskRunning(row.submit_record_id)"
                  :disabled="isSingleTaskRunning(row.submit_record_id)"
                  @click="handleAIReview(row)"
                >
                  {{
                    isSingleTaskRunning(row.submit_record_id)
                        ? '批改中...'
                        : (row.is_reviewed ? '重新批改' : 'AI批改')
                  }}
                </el-button>
                <el-icon v-if="isSingleTaskRunning(row.submit_record_id)" class="is-loading" style="animation: rotating 2s linear infinite;">
                  <Loading />
                </el-icon>
              </div>
              <el-tag v-else type="info" size="small">未提交</el-tag>
            </template>
          </el-table-column>
          </el-table>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar, Clock, Document, Refresh, Loading } from '@element-plus/icons-vue'
import { useTeacherStore } from '@/stores/useTeacherStore'
import { useAiGradingStore } from '@/stores/useAiGradingStore'
import type { UploadProps, UploadUserFile } from 'element-plus'

const teacherStore = useTeacherStore()
const aiGradingStore = useAiGradingStore()

const loading = ref(false)
const dialogVisible = ref(false)
const selectedCourseId = ref<number>()

const form = ref({
  title: '',
  description: '',
  courseId: undefined as unknown as number,
  classId: undefined as unknown as number,
  pushDate: '',
  endDate: ''
})

// 获取当前时间的格式化字符串
const getCurrentDateTime = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 根据选择的课程过滤作业
const filteredHomeworks = computed(() => {
  // 后端已经按course_id过滤，直接返回
  return teacherStore.homeworks || []
})

// 计算提交百分比
const getSubmitPercentage = (homework: any) => {
  if (!homework.student_count || homework.student_count === 0) return 0
  return Math.round((homework.submit_count / homework.student_count) * 100)
}

// 根据提交情况获取进度条颜色
const getProgressColor = (homework: any) => {
  const percentage = getSubmitPercentage(homework)
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 50) return '#e6a23c'
  return '#f56c6c'
}

// 判断是否全部批改完成（使用 submit_count === student_count）
const isFullyReviewed = (homework: any) => {
  if (!homework.submit_count || !homework.student_count) return false
  return homework.submit_count === homework.student_count
}

// 提交详情对话框状态
const subDialogVisible = ref(false)
const subLoading = ref(false)
const students = ref<any[]>([])

// 批量批改相关状态
const selectedStudents = ref<any[]>([])
const tableRef = ref<any>(null)
const isSingleTaskRunning = (submitRecordId: number) => {
  const task = aiGradingStore.singleTasks[submitRecordId]
  return task?.status === 'pending' || task?.status === 'running'
}

// 查看作业提交详情（悬浮窗）
const viewSubmissions = async (homework: any) => {
  subDialogVisible.value = true
  subLoading.value = true
  try {
    const list = await teacherStore.fetchHomeworkStudents(Number(homework.homework_id))
    students.value = list || []
  } finally {
    subLoading.value = false
  }
}

// 处理AI批改

const handleAIReview = async (student: any) => {
  const recordId = student.submit_record_id

  if (!recordId) {
    ElMessage.error('该学生尚未提交作业')
    return
  }

  const result = await aiGradingStore.submitSingle(recordId)
  if (!result?.score && result?.score !== 0) return

  student.score = result.score
  student.is_reviewed = true
  ElMessage.success(`批改完成！得分：${result.score}分`)
  await loadHomeworks()
}

// 对话框关闭时的处理（不清理正在进行的轮询，让其继续在后台运行）
const handleDialogClose = () => {
  selectedStudents.value = []
}

// 判断行是否可选（允许已批改的作业重新批改）
const isRowSelectable = (row: any) => {
  return row.is_done && row.submit_record_id
}

// 处理表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedStudents.value = selection.filter(row => isRowSelectable(row))
}

// 清空选择
const clearSelection = () => {
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
  selectedStudents.value = []
}

// 批量AI批改
const handleBatchAIReview = async () => {
  if (!selectedStudents.value.length) {
    ElMessage.warning('请先选择要批改的学生')
    return
  }

  const submitRecordIds = selectedStudents.value
    .map(s => s.submit_record_id)
    .filter(Boolean)

  if (submitRecordIds.length === 0) {
    ElMessage.warning('所选学生中没有可批改的提交记录')
    return
  }

  const result = await aiGradingStore.submitBatch(submitRecordIds)
  result?.result?.forEach((item: any) => {
    const student = students.value.find(s => s.submit_record_id === item.submit_record_id)
    if (student) {
      student.score = item.score
      student.is_reviewed = true
    }
  })
  if (result) {
    ElMessage.success(`批量批改完成！共批改 ${submitRecordIds.length} 份作业`)
    await loadHomeworks()
    clearSelection()
  }
}

// 课程切换
const handleCourseChange = async () => {
  await loadHomeworks()
}

// 加载作业列表
const loadHomeworks = async () => {
  loading.value = true
  try {
    await teacherStore.fetchHomeworks(selectedCourseId.value)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    courseId: undefined as unknown as number,
    classId: undefined as unknown as number,
    pushDate: '',
    endDate: ''
  }
  // 清空表单中的日期选择
  form.value.pushDate = ''
  form.value.endDate = ''
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}
const fileList = ref<UploadUserFile[]>([])


const handleRemove: UploadProps['onRemove'] = () => {
  fileList.value = []
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  ElMessage.info(`已选择：${uploadFile.name}`)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 1, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}
const handleSubmit = async () => {
  if (!form.value.title || !form.value.courseId) {
    ElMessage.warning('请填写标题和课程')
    return
  }
  
  if (!form.value.endDate) {
    ElMessage.warning('请选择截止时间')
    return
  }
  
  const formatDateTime = (date: Date | string) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  
  // 发布时间使用当前时间，班级根据课程自动获取

  const selectedFile = ref<File | null>(null)
  selectedFile.value = fileList.value[0]?.raw ?? null

  await teacherStore.publishAssignment(
    form.value.courseId,
    form.value.title,
    form.value.description,
    getCurrentDateTime(),
    formatDateTime(form.value.endDate),
    (selectedFile.value as File)
  )
  dialogVisible.value = false
  
  // 刷新作业列表
  await loadHomeworks()
}

const refresh = async () => {
  loading.value = true
  await Promise.all([
    teacherStore.fetchCourseList(),
    teacherStore.fetchClassList(),
    loadHomeworks()
  ])
  loading.value = false
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    teacherStore.fetchCourseList(),
    teacherStore.fetchClassList(),
  ])
  
  // 默认选择第一个课程
  if (teacherStore.courseList.length > 0) {
    selectedCourseId.value = teacherStore.courseList[0].id
    await loadHomeworks()
  }
  
  loading.value = false
})
</script>

<style scoped>
.assignments-page {
  padding: 16px 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 11px 0 20px 0;
}

.course-selector {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.course-selector .label {
  font-weight: 500;
  margin-right: 12px;
  color: #606266;
}

.homework-list {
  min-height: 400px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.homework-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.homework-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.homework-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-content {
  padding-top: 8px;
}

.description {
  color: #606266;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #909399;
}

.info-row .el-icon {
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
