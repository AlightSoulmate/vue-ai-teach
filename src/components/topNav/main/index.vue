<template>
  <el-row class="nav">
    <!-- logo -->
    <el-col :span="4" class="iconNav">
      <IconNav />
    </el-col>
    <!-- 搜索 -->
    <el-col :span="7" class="searchNav">
      <SearchNav />
    </el-col>
    <!-- 主题 -->
    <el-col :span="4" class="themeNav">
      <themeNav />
    </el-col>
    <!-- 用户 -->
    <el-col :span="6" class="userNav">
      <IndividualNav />
    </el-col>
    <!-- 帮助 -->
    <el-col :span="3" class="helpNav">
      <HelpNav />
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import IconNav from "../use/iconNav.vue";
import SearchNav from "../use/searchNav.vue";
import IndividualNav from "../use/IndividualNav.vue";
import HelpNav from "../use/helpNav.vue";
import themeNav from "../use/themeNav.vue";
</script>

<style scoped>
.nav {
  min-height: 55px;
  line-height: 55px;
  background-color: rgba(0, 0, 0, 0.473);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--text-color);
}
</style>
