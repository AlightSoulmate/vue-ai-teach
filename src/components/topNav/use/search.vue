<script lang="ts" setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";

const searchText = ref("");
const fakeSearch = () => {
  console.log("click search");
};
</script>

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
