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
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleNicknameUpdate(row)"
            title="nickname"
          >
            Modify Nickname
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleUsernameUpdate(row)"
            title="username"
          >
            Modify Username
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleDeleteUpdate(row)"
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
import { ElMessage, ElMessageBox } from "element-plus";
import { useAdminStore } from "@/stores/useAdminStore";

const object = ref("student");
const adminStore = useAdminStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
const handleNicknameUpdate = (row: any) => {
  ElMessageBox.prompt("请输入新昵称", "修改昵称", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{2,10}$/,
    inputErrorMessage: "昵称长度必须在2-10位之间",
  })
    .then(({ value }) => {
      if (value) {
        const user = {
          id: row.id,
          nickname: value,
          username: row.username,
        };
        let password = "";
        adminStore.UpdateUserInfo(
          user.id,
          object.value,
          password,
          user.nickname,
          user.username
        );
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};
const handleUsernameUpdate = (row: any) => {
  console.log(row);
  ElMessageBox.prompt(
    `对原用户名 ${row.username} 进行修改，请即输入新用户名（不建议随意修改用户名）`,
    "修改用户名",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /^.{2,18}$/,
      inputErrorMessage: "用户名长度必须在2-18位之间",
    }
  )
    .then(({ value }) => {
      if (value) {
        const user = {
          id: row.id,
          nickname: row.nickname,
          username: value,
        };
        let password = "";
        adminStore.UpdateUserInfo(
          user.id,
          object.value,
          password,
          user.nickname,
          user.username
        );
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};
const handleDeleteUpdate = (row: any) => {
  console.log("handleDeleteUpdate");
};
watch(currentPage, (newVal) => {
  adminStore.fetchStudents();
});
onMounted(() => {
  adminStore.fetchStudents();
});
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
