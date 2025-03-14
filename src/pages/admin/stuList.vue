<template>
  <h1 class="title">学生管理</h1>
  <div class="before-container">
    <div class="search">
      <el-icon><Search /></el-icon>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="根据用户名查找学生"
        @select="handleSelect"
      >
        <template #loading>
          <svg class="circular" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" />
          </svg>
        </template>
      </el-autocomplete>
    </div>
    <div class="add">
      <Add v-model="text" />
    </div>
  </div>
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
            @click="handlePasswordUpdate(row)"
            title="password"
          >
            Modify Password
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleDeleteUpdate(row)"
            size="small"
            style="color: red"
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
import { Search } from "@element-plus/icons-vue";
// @ts-ignore
import Add from "@/pages/admin/component/button.vue";
// 考虑/view 重命名为 /pages
const object = ref("student");
const adminStore = useAdminStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const state = ref("");
const text = ref("添加新学生");

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
        adminStore.updateUserInfo(
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
  ElMessageBox.prompt(`请输入新用户名 (不建议随意修改用户名)`, "修改用户名", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{2,18}$/,
    inputErrorMessage: "用户名长度必须在2-18位之间",
  })
    .then(({ value }) => {
      if (value) {
        const user = {
          id: row.id,
          nickname: row.nickname,
          username: value,
        };
        let password = "";
        adminStore.updateUserInfo(
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
const handlePasswordUpdate = (row: any) => {
  ElMessageBox.prompt(`请输入新密码 (不建议随意修改密码)`, "修改密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{6,18}$/,
    inputErrorMessage: "密码长度必须在6-18位之间",
  })
    .then(({ value }) => {
      if (value) {
        const user = {
          id: row.id,
          password: value,
          nickname: row.nickname,
          username: row.username,
        };
        adminStore.updateUserInfo(
          user.id,
          object.value,
          user.password,
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
  ElMessageBox.confirm(
    `该操作将永久删除用户 (昵称:${row.nickname} 用户名:${row.username}) ,请谨慎操作`,
    "确认删除",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      ElMessage({
        type: "success",
        message: "Delete completed",
      });
      adminStore.deleteUser(row.id, object.value);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};
let timeout: ReturnType<typeof setTimeout>;
const querySearchAsync = (
  queryString: string,
  callback: (arg: any) => void
) => {
  const results = queryString
    ? adminStore.students.filter(createFilter(queryString))
    : adminStore.students;
  const formattedResults = results.map((student) => ({
    value: student.username,
    ...student,
  }));
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    callback(formattedResults);
  }, 1500 * Math.random());
};
const createFilter = (queryString: string) => {
  return (student: any) => {
    return (
      student.username.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};
const handleSelect = (item: any) => {
  console.log(item);
  const selectedStudentId = item.id;
  console.log(selectedStudentId);
};

watch(currentPage, () => {
  adminStore.fetchStudents();
});

onMounted(() => {
  setTimeout(() => {
    adminStore.fetchStudents();
  }, 100);
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
.before-container {
  display: flex;
  justify-content: space-between;
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
.add {
  width: 5%;
  margin: 10px 130px 10px 0;
  transform: scale(0.9);
}
// 搜索
.search {
  width: 30%;
  margin: 10px 0 10px 50px;
  display: flex;

  .el-icon {
    margin-right: 5px;
    margin-top: 5px;
    font-size: 20px;
    color: #969696;
  }

  .el-autocomplete {
    width: 100%;
  }
}
.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
