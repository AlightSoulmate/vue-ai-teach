<template>
  <h1 class="title">学生管理</h1>
  <div class="container">
    <el-table
      :data="adminStore.students"
      style="width: 100%"
      stripe
      highlight-current-row
    >
      <el-table-column
        prop="id"
        label="ID"
        width="100"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="nickname"
        label="Nickname"
        width="160"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="username"
        label="Username"
        width="160"
        header-align="center"
        align="center"
      />
      <el-table-column
        fixed="right"
        label="Operations"
        min-width="260"
        header-align="center"
        align="center"
      >
        <template #default>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleNicknameUpdate"
            title="nickname"
          >
            Modify Nickname
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleUsernameUpdate"
            title="username"
          >
            Modify Username
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleDeleteUpdate"
            title="password"
          >
            Modify Password
          </el-button>
          <el-button link type="primary" size="small" style="color: red"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      class="pagination"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
      layout="total, prev, pager, next, jumper"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useAdminStore } from "@/stores/useAdminStore";

const adminStore = useAdminStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const handlePageChange = (page) => {
  currentPage.value = page;
};
const handleNicknameUpdate = () => {
  console.log("handleNicknameUpdate");
};
const handleUsernameUpdate = () => {
  console.log("handleUsernameUpdate");
};
const handleDeleteUpdate = () => {
  console.log("handleDeleteUpdate");
};
watch(currentPage, (newVal) => {
  adminStore.fetchStudents();
});
onMounted(() => {
  adminStore.fetchStudents();
});
const tableStudentData = [
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
  {
    id: 20,
    nickname: "Luca",
    username: "cxt9",
  },
];
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.title {
  color: var(--text-color);
  margin: 11px 0 20px 45px;
  font-size: 20px;
  font-weight: 600;
}
.container {
  max-width: 1200px;
  margin: auto 50px;
  border-top: 1px #ccc solid;
  border-bottom: 1px #ccc solid;
  .pagination {
    margin: 5px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
