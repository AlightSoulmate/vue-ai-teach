<template>
  <div class="search-container">
    <el-input
      v-model="searchText"
      placeholder="搜索..."
      class="search-input"
      :prefix-icon="Search"
      @click="fakeSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const searchText = ref("");
const fakeSearch = () => {
  console.log('click search');
  // ElMessage({
  //   message: "模块尚未开发",
  //   type: "warning",
  // });
};
</script>

<style scoped>
.search-container {
  margin-left: 24px;
}

.search-input {
  width: 150px;
  transition: all 0.3s;
}

.search-input:focus {
  width: 320px;
}

:deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-input__inner) {
  font-size: 14px;
}
</style>
