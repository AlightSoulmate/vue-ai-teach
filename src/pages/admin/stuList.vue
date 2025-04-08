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
    <div class="refresh">
      <el-button @click="manualRefresh" type="primary" size="small"
        >手动刷新列表</el-button
      >
    </div>
    <div class="add">
      <div
        class="button"
        data-tooltip="Size: 20Mb"
        @click="dialogVisible = true"
      >
        <div class="button-wrapper">
          <div class="text" :title="text">{{ text }}</div>
          <el-icon class="icon" style="transform: scale(1.2)"><Plus /></el-icon>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加学生对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="添加新学生"
    width="30%"
    :before-close="handleDialogClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>

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
        width="80"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="nickname"
        label="Nickname"
        width="120"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="username"
        label="Username"
        width="120"
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
            修改昵称
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleUsernameUpdate(row)"
            title="username"
          >
            修改用户名
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handlePasswordUpdate(row)"
            title="password"
          >
            修改密码
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleDeleteUpdate(row)"
            size="small"
            style="color: red"
            >删除</el-button
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
import { Search, Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";

const object = ref("student");
const adminStore = useAdminStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const state = ref("");
const text = ref("添加新学生");

// 添加学生相关
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const form = ref({
  username: "",
  nickname: "",
  password: "",
});

const rules = ref<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 6, max: 18, message: "用户名长度必须在6-18位之间", trigger: "blur" },
  ],
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 18, message: "昵称长度必须在2-18位之间", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度必须在6-18位之间", trigger: "blur" },
  ],
});

const handleDialogClose = (done: () => void) => {
  formRef.value?.resetFields();
  done();
};

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await adminStore.addUser(
          form.value.nickname,
          form.value.username,
          form.value.password,
          "student"
        );

        dialogVisible.value = false;
        formRef.value?.resetFields();
        adminStore.fetchStudents();
        ElMessage.success("添加学生成功");
      } catch (error) {}
    }
  });
};

const manualRefresh = async () => {
  try {
    await adminStore.fetchStudents();
    ElMessage.success("列表刷新成功");
  } catch (error) {
    ElMessage.error("刷新失败: " + (error as Error).message);
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleNicknameUpdate = (row: any) => {
  ElMessageBox.prompt("请输入新昵称", "修改昵称", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{2,18}$/,
    inputErrorMessage: "昵称长度必须在2-18位之间",
    inputValue: row.nickname,
  })
    .then(({ value }) => {
      if (value) {
        let user = {
          id: row.id,
          nickname: value,
          username: row.username,
        };
        let password = "";
        adminStore
          .updateUserInfo(
            user.id,
            object.value,
            password,
            user.nickname,
            user.username
          )
          .then(() => {
            adminStore.fetchStudents();
            ElMessage.success("修改昵称成功");
          });
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
  ElMessageBox.prompt(`请输入新用户名 (一般为学号、工号，不建议随意修改)`, "修改用户名", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{6,18}$/,
    inputErrorMessage: "用户名长度必须在6-18位之间",
    inputValue: row.username,
  })
    .then(({ value }) => {
      if (value) {
        let user = {
          id: row.id,
          nickname: row.nickname,
          username: value,
        };
        let password = "";
        adminStore
          .updateUserInfo(
            user.id,
            object.value,
            password,
            user.nickname,
            user.username
          )
          .then(() => {
            adminStore.fetchStudents();
            ElMessage.success("修改用户名成功");
          });
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
        adminStore
          .updateUserInfo(
            user.id,
            object.value,
            user.password,
            user.nickname,
            user.username
          )
          .then(() => {
            adminStore.fetchStudents();
            ElMessage.success("修改密码成功");
          });
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
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        await adminStore.deleteUser(row.id, object.value);
        adminStore.fetchStudents();
        ElMessage.success("删除用户成功");
      } catch (error) {
        ElMessage({
          type: "error",
          message: `删除失败: ${(error as Error).message}`,
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除操作",
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
    total.value = adminStore.totalStudents;
  }, 100);
});

watch(
  () => adminStore.totalStudents,
  (newValue) => {
    total.value = newValue;
  }
);
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.title {
  color: var(--text-color);
  margin: 11px 0 20px 45px;
  font-size: 20px;
  font-weight: 600;
}

.debug-section {
  margin: 0 50px 15px;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px dashed #ccc;
  border-radius: 4px;
  font-size: 12px;

  pre {
    margin-bottom: 10px;
    white-space: pre-wrap;
  }
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
.refresh {
  margin: 13px 130px 10px 0;
}
.add {
  width: 5%;
  margin: 10px 130px 10px 0;
  transform: scale(0.9);
}

.button {
  --width: 100px;
  --height: 35px;
  --tooltip-height: 35px;
  --tooltip-width: 90px;
  --gap-between-tooltip-to-button: 18px;
  --button-color: #1163ff;
  --tooltip-color: #fff;
  width: var(--width);
  height: var(--height);
  background: var(--button-color);
  position: relative;
  text-align: center;
  border-radius: 0.45em;
  cursor: pointer;
  transition: background 0.3s;
}

.button::after,
.button::before {
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s;
}

.text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-wrapper,
.text,
.icon {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  color: #fff;
}

.text {
  top: 0;
}

.text,
.icon {
  transition: top 0.5s;
}

.icon {
  color: #fff;
  top: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button:hover {
  background: #6c18ff;
}

.button:hover .text {
  top: -100%;
}

.button:hover .icon {
  top: 0;
}

.button:hover:before,
.button:hover:after {
  opacity: 1;
  visibility: visible;
}

.button:hover:after {
  bottom: calc(var(--height) + var(--gap-between-tooltip-to-button) - 20px);
}

.button:hover:before {
  bottom: calc(var(--height) + var(--gap-between-tooltip-to-button));
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
