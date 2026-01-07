<template>
  <div class="course-page">课程管理</div>

  <!-- 创建课程按钮 -->
  <div class="action-bar">
    <el-button type="primary" @click="openDialog('create')">
      <el-icon>
        <Plus />
      </el-icon>创建新课程
    </el-button>
  </div>

  <!-- 课程卡片网格 -->
  <div class="course-grid">
    <teaCard v-for="course in teacherStore.courseList" :key="course.id" :course="{
      imageUrl: `https://a1.x914.com/alight/i/2025/06/05/qzys.png`,
      name: course.course,
      classes: course.cno
    }" @click="handleCardClick(course)" />
  </div>

  <!-- 课程详情抽屉 -->
  <el-drawer v-model="drawerVisible" title="课程详情" size="50%" :destroy-on-close="true">
    <template #default>
      <div class="course-detail">
        <div class="detail-header">
          <h2>{{ selectedCourse?.course }}</h2>
          <div class="detail-actions">
            <el-button type="primary" @click="openDialog('edit', selectedCourse)">
              修改课程
            </el-button>
          </div>
        </div>
        <div class="detail-content">
          <div class="detail-item">
            <span class="label">课程ID：</span>
            <span>{{ selectedCourse?.id }}</span>
          </div>
          <div class="detail-item">
            <span class="label">所属班级：</span>
            <span class="clickable-class" @click="viewRates(selectedCourse.cno)">{{ selectedCourse.cno }}</span>
            <!-- <span v-for="(className, idx) in selectedCourse.cno" :key="idx" class="clickable-class"
              @click="viewRates(className)">
              <span v-if="idx !== 0">、</span>
              {{ className }}
            </span> -->
          </div>
          <div class="detail-item">
            <span class="label">课程描述：</span>
            <p class="description">{{ selectedCourse?.description }}</p>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>

  <!-- 保留原有的创建/编辑对话框和评价记录对话框 -->
  <!-- 创建/编辑课程对话框 -->
  <el-dialog :title="dialogType === 'create' ? '创建新课程' : '编辑课程'" v-model="dialogVisible" width="500px">
    <el-form :model="courseForm" label-width="90px">
      <el-form-item label="课程名称">
        <el-input v-model="courseForm.course" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="课程描述">
        <el-input type="textarea" v-model="courseForm.description" placeholder="请输入课程描述" :rows="3" />
      </el-form-item>
      <el-form-item label="所属班级">
        <el-select v-model="courseForm.cno" collapse-tags placeholder="请选择班级" style="width: 100%">
          <el-option v-for="item in teacherStore.classList" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
              {{ item.id }}
            </span>
          </el-option>
        </el-select>
        <!-- <el-select v-model="courseForm.cno" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
          placeholder="请选择班级" style="width: 100%">
          <el-option v-for="item in teacherStore.classList" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
              {{ item.id }}
            </span>
          </el-option>
        </el-select> -->
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 查看评价记录对话框 -->
  <el-dialog title="学生评价记录" v-model="ratesDialogVisible" width="80%">
    <el-table :data="teacherStore.rates" style="width: 100%" highlight-current-row stripe @row-click="handleRowClick">
      <el-table-column prop="username" label="昵称" width="140" />
      <el-table-column prop="nickname" label="用户名" width="140" />
      <el-table-column prop="review" label="工具评价次数" width="140" />
      <el-table-column prop="report" label="作业提交次数" width="140" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTeacherStore } from "@/stores/useTeacherStore"
import teaCard from '@/components/course/teaCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const teacherStore = useTeacherStore()
const dialogVisible = ref(false)
const ratesDialogVisible = ref(false)
const dialogType = ref('create')

const courseForm = ref({
  id: '',
  course: '',
  description: '',
  cno: ""
})
const isCreate = ref(true);
const drawerVisible = ref(false)
const selectedCourse = ref<any>(null)
const selectedClasses = ref<any[]>([])

const openDialog = (type: string, row?: any) => {
  dialogType.value = type
  dialogVisible.value = true
  if (type === 'edit' && row) {
    courseForm.value = {
      ...row,
      // cno: Array.isArray(row.cno) ? row.cno : [row.cno]
    }
    isCreate.value = false
  } else {
    isCreate.value = true
    courseForm.value = {
      id: '',
      course: '',
      description: '',
      cno: ""
      // cno: []
    }
  }
}

// 保存课程
const handleSave = () => {
  if (!courseForm.value.course) {
    ElMessage.warning('请输入课程名称')
    return
  }
  if (courseForm.value.cno === "") {
    ElMessage.warning('请选择班级')
    return
  }
  // if (courseForm.value.cno.length === 0) {
  //   ElMessage.warning('请至少选择一个班级')
  //   return
  // }
  console.log('课程表单数据:', courseForm.value)
  if (isCreate.value) {
    teacherStore.createCourse(
      courseForm.value.course,
      courseForm.value.description,
      courseForm.value.cno
    )
  } else {
    teacherStore.changeCourse(
      Number(courseForm.value.id),
      courseForm.value.course,
      courseForm.value.description,
      courseForm.value.cno
    )
  }

  teacherStore.fetchCourseList()
  ElMessage.success(dialogType.value === 'create' ? '创建成功' : '更新成功')

  // 1.获取班级列表
  teacherStore.fetchClassList();
  // 2.获取课程列表
  teacherStore.fetchCourseList();

  dialogVisible.value = false
}

// 查看评价记录
const viewRates = async (cno: any) => {
  let class_id = teacherStore.filterClassId(cno);
  console.log('查看评价记录的班级ID:', cno, " ", class_id);
  await teacherStore.fetchHistoryByClass(class_id);
  setTimeout(() => {
    ratesDialogVisible.value = true
  }, 100)
}

const handleCardClick = (course: any) => {
  selectedCourse.value = course
  selectedClasses.value = course.cno
  drawerVisible.value = true
}

// 处理行点击
const handleRowClick = (row: any) => {
  // 关闭当前对话框
  ratesDialogVisible.value = false
  let username = row.username;

  // 跳转到学生详情页面
  // router.push({
  //   path: '/persona',
  // })
}

onMounted(() => {
  setTimeout(() => {
    // 1.获取班级列表
    teacherStore.fetchClassList();
    // 2.获取课程列表
    teacherStore.fetchCourseList();
  }, 100)
  console.log('班级列表:', teacherStore.classList);
  console.log('课程列表:', teacherStore.courseList);
})
</script>

<style scoped lang="scss">
.course-page {
  color: var(--text-color);
  margin: 11px 0 20px 45px;
  font-size: 20px;
  font-weight: 600;
}

.action-bar {
  margin: 0 20px 20px 45px;
}

.container-rates {
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 20px;
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-fill-color-light);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table__header-wrapper) th {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-weight: 600;
  height: 50px;
  text-align: center;
}

:deep(.el-table__row) td {
  padding: 12px 0;
  text-align: center;
}

:deep(.el-button) {
  margin: 0 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px;
  margin: 0 20px;
}

.course-detail {
  padding: 20px;

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-light);

    h2 {
      margin: 0;
      color: var(--el-text-color-primary);
    }

    .detail-actions {
      display: flex;
      gap: 12px;
    }
  }

  .detail-content {
    .detail-item {
      margin-bottom: 16px;

      .label {
        color: var(--el-text-color-regular);
        margin-right: 8px;
        font-weight: 500;
      }

      .description {
        margin-top: 8px;
        color: var(--el-text-color-regular);
        line-height: 1.6;
      }
    }
  }
}

:deep(.el-table__row) {
  cursor: pointer;

  &:hover {
    background-color: var(--el-table-row-hover-bg-color);
  }
}

@media screen and (max-width: 768px) {
  .container-rates {
    margin: 0 10px;
    padding: 10px;
  }

  .course-page {
    margin: 10px 0 15px 20px;
    font-size: 18px;
  }

  .action-bar {
    margin: 0 10px 15px 20px;
  }

  .course-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 10px;
    margin: 0 10px;
  }
}

.clickable-class {
  margin-right: 8px;
  cursor: pointer;
  color: #409EFF;
}

.clickable-class:hover {
  color: #66b1ff;
}
</style>
