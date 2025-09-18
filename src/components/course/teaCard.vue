<template>
  <div class="course-card">
    <div class="course-image">
      <img :src="course.imageUrl" :alt="course.name" class="image" />
    </div>
    <div class="course-info">
      <h3 class="course-name">{{ course.name }}</h3>
      <div class="classes-info">
        <el-icon>
          <School />
        </el-icon>
        <span class="classes-text">{{ course.classes }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { School } from '@element-plus/icons-vue'

interface Course {
  imageUrl: string;
  name: string;
  classes: string;
}

defineProps<{
  course: Course;
}>();
</script>

<style scoped lang="scss">
.course-card {
  cursor: pointer;

  .course-image {
    width: 100%;
    height: 150px;
    overflow: hidden;
    border-radius: 8px;
    position: relative;

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.03);
      }
    }
  }

  .classes-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-icon {
      font-size: 16px;
      color: #409EFF;
    }

    .classes-text {
      font-size: 14px;
      color: #606266;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>