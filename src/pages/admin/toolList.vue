<template>
  <h1 class="title">工具管理</h1>
  <div class="before-container">
    <div class="search">
      <el-icon><Search /></el-icon>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="根据工具名称查找"
        @select="handleSelect"
        clearable
        @clear="clearSelection"
      >
        <template #loading>
          <svg class="circular" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" />
          </svg>
        </template>
      </el-autocomplete>
      <el-button
        v-if="selectedTool"
        link
        type="primary"
        @click="clearSelection"
        style="margin-left: 10px"
      >
        清除筛选
      </el-button>
    </div>
    <div class="actions">
      <el-button
        class="refresh-btn"
        type="primary"
        :icon="Refresh"
        circle
        @click="refreshTools"
        title="刷新工具列表"
      ></el-button>
      <div class="add" @click="handleAddTool">
        <Add v-model="text" />
      </div>
    </div>
  </div>
  <div class="container">
    <el-table
      :data="sortedAndFilteredTools"
      style="width: 100%"
      stripe
      highlight-current-row
      @sort-change="handleSortChange"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="75"
        header-align="center"
        align="center"
        sortable="custom"
      />
      <el-table-column
        prop="name"
        label="工具名称"
        width="110"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="category"
        label="分类"
        width="110"
        header-align="center"
        align="center"
        sortable="custom"
        :filters="categoryFilters"
        :filter-method="filterCategory"
      />
      <el-table-column
        prop="description"
        label="描述"
        min-width="150"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="url"
        label="链接"
        width="180"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="logo_url"
        label="图片链接"
        width="180"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="score"
        label="评分"
        width="90"
        header-align="center"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }"> {{ row.score ?? "暂无" }} ⭐ </template>
      </el-table-column>
      <el-table-column
        prop="ratingCount"
        label="评分数"
        width="90"
        header-align="center"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }">
          {{ row.ratingCount ?? 0 }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="260"
        header-align="center"
        align="center"
      >
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleNameUpdate(row)"
          >
            修改名称
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleDescriptionUpdate(row)"
          >
            修改描述
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleCategoryUpdate(row)"
          >
            修改分类
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleDeleteUpdate(row)"
            size="small"
            style="color: red"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="!selectedTool"
      :current-page="currentPage"
      class="pagination"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
      layout="total, prev, pager, next, jumper"
    />
  </div>

  <!-- 添加工具对话框 -->
  <el-dialog
    v-model="addToolDialogVisible"
    title="添加新工具"
    width="600px"
    top="5vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="toolFormRef"
      :model="toolForm"
      :rules="toolFormRules"
      label-width="100px"
      label-position="right"
      class="tool-form"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="工具名称" prop="name">
            <el-input
              v-model="toolForm.name"
              placeholder="请输入工具名称"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="工具分类" prop="category">
            <el-select
              v-model="toolForm.category"
              placeholder="请选择工具分类"
              style="width: 100%"
              filterable
              allow-create
            >
              <el-option
                v-for="category in toolsStore.categories"
                :key="category"
                :label="category"
                :value="category"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="工具链接" prop="url">
            <el-input
              v-model="toolForm.url"
              placeholder="请输入工具链接（如：https://www.example.com）"
            ></el-input>
          </el-form-item>

          <el-form-item label="Logo链接" prop="logo_url">
            <el-input
              v-model="toolForm.logo_url"
              placeholder="请输入Logo链接"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" class="preview-col">
          <div class="logo-preview">
            <p>Logo预览</p>
            <div class="preview-container">
              <img
                v-show="logoValid && toolForm.logo_url"
                :src="previewLogoUrl"
                alt="Logo预览"
                class="preview-image"
              />
              <div
                v-show="!logoValid || !toolForm.logo_url"
                class="placeholder-image"
              >
                <el-icon style="font-size: 24px; color: #909399"
                  ><Picture
                /></el-icon>
                <span>无效图片链接</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-form-item label="工具描述" prop="description">
        <el-input
          v-model="toolForm.description"
          type="textarea"
          :rows="4"
          placeholder="请输入工具描述（5-200字）"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAddTool">取 消</el-button>
        <el-button type="primary" @click="submitAddTool">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { useToolsStore } from "@/stores/useToolsStore";
import { useAdminStore } from "@/stores/useAdminStore";
import { Search, Picture, Refresh } from "@element-plus/icons-vue";
// @ts-ignore
import Add from "@/pages/admin/component/button.vue";

const toolsStore = useToolsStore();
const adminStore = useAdminStore();
const currentPage = ref(1);
const pageSize = ref(14);
const total = ref(0);
const state = ref("");
const text = ref("添加新工具");
const selectedTool = ref<any>(null);

// 添加工具对话框和表单
const addToolDialogVisible = ref(false);
const toolFormRef = ref();
const toolForm = reactive({
  name: "",
  category: "",
  url: "",
  logo_url: "",
  description: "",
});

// 表单验证规则
const toolFormRules = {
  name: [
    { required: true, message: "请输入工具名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
  ],
  category: [
    { required: true, message: "请输入工具分类", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  url: [
    { required: true, message: "请输入工具网站链接", trigger: "blur" },
    {
      pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
      message: "请输入有效的URL",
      trigger: "blur",
    },
  ],
  logo_url: [
    { required: true, message: "请输入Logo链接", trigger: "blur" },
    {
      pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
      message: "请输入有效的URL",
      trigger: "blur",
    },
  ],
  description: [
    { required: true, message: "请输入工具描述", trigger: "blur" },
    { min: 5, max: 200, message: "长度在 5 到 200 个字符", trigger: "blur" },
  ],
};

const sortOrder = ref<{
  prop: string | null;
  order: "ascending" | "descending" | null;
}>({
  prop: "id",
  order: "ascending",
});

// 获取工具列表
const toolsList = computed(() => {
  return Object.values(toolsStore.toolsByCategory || {}).flat();
});

// 获取分类
const categoryFilters = computed(() => {
  const categories = Array.from(
    new Set(toolsList.value.map((tool) => tool.category))
  );
  return categories.map((category) => ({
    text: category,
    value: category,
  }));
});

// 分类筛选
const filterCategory = (value: string, row: any) => {
  return row.category === value;
};

// 排序和筛选后的工具列表
const sortedAndFilteredTools = computed(() => {
  let result = [...toolsList.value];

  // 如果有选中的工具，只显示该工具
  if (selectedTool.value) {
    result = result.filter((tool) => tool.id === selectedTool.value.id);
    return result;
  }

  // 排序
  if (sortOrder.value.prop && sortOrder.value.order) {
    result.sort((a, b) => {
      const prop = sortOrder.value.prop as keyof typeof a;
      const aValue = a[prop] ?? 0;
      const bValue = b[prop] ?? 0;

      if (sortOrder.value.order === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  total.value = result.length;

  return result.slice(startIndex, endIndex);
});

// 处理排序变化
const handleSortChange = (sort: {
  prop: string;
  order: "ascending" | "descending" | null;
}) => {
  sortOrder.value = sort;
};

// 刷新工具列表
const refreshTools = async () => {
  try {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: "正在刷新数据...",
      background: "rgba(0, 0, 0, 0.7)",
    });

    // 清空缓存
    localStorage.removeItem("toolCategories");
    localStorage.removeItem("toolsByCategory");
    localStorage.removeItem("toolsCacheTime");

    // 重新获取分类和工具数据
    await toolsStore.fetchCategory();

    loadingInstance.close();

    ElMessage({
      type: "success",
      message: "数据已刷新",
      duration: 2000,
    });
  } catch (error) {
    ElMessage.error(`刷新失败：${error}`);
  }
};

const handleNameUpdate = (row: any) => {
  ElMessageBox.prompt("请输入新名称", "修改工具名称", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{2,50}$/,
    inputErrorMessage: "名称长度必须在2-50位之间",
    inputValue: row.name,
  })
    .then(async ({ value }) => {
      if (value) {
        const toolId = row.id;
        const name = value;
        const category = row.category;
        const url = row.url;
        const logo_url = row.logo_url;
        const description = row.description;
        await adminStore.updateToolInfo(
          toolId,
          name,
          category,
          url,
          logo_url,
          description
        );
        // 刷新工具列表
        await refreshTools();
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};

const handleDescriptionUpdate = (row: any) => {
  ElMessageBox.prompt("请输入新描述", "修改工具描述", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{5,200}$/,
    inputErrorMessage: "描述长度必须在5-200位之间",
    inputValue: row.description,
  })
    .then(async ({ value }) => {
      if (value) {
        const toolId = row.id;
        const name = row.name;
        const category = row.category;
        const url = row.url;
        const logo_url = row.logo_url;
        const description = value;
        await adminStore.updateToolInfo(
          toolId,
          name,
          category,
          url,
          logo_url,
          description
        );
        // 刷新工具列表
        await refreshTools();
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};

const handleCategoryUpdate = (row: any) => {
  ElMessageBox.prompt("请输入新分类", "修改工具分类", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{2,20}$/,
    inputErrorMessage: "分类长度必须在2-20位之间",
    inputValue: row.category,
  })
    .then(async ({ value }) => {
      if (value) {
        const toolId = row.id;
        const name = row.name;
        const category = value;
        const url = row.url;
        const logo_url = row.logo_url;
        const description = row.description;
        await adminStore.updateToolInfo(
          toolId,
          name,
          category,
          url,
          logo_url,
          description
        );
        // 刷新工具列表
        await refreshTools();
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
    `该操作将永久删除工具 "${row.name}"，请谨慎操作`,
    "确认删除",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      const toolId = row.id;
      await adminStore.deleteTool(toolId);
      // 刷新工具列表
      await refreshTools();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};

// 处理添加工具
const handleAddTool = () => {
  addToolDialogVisible.value = true;
  if (toolsStore.categories.length > 0) {
    toolForm.category = toolsStore.categories[0];
  }
};

// 重置表单
const resetToolForm = () => {
  toolFormRef.value?.resetFields();
};

// 取消添加
const cancelAddTool = () => {
  addToolDialogVisible.value = false;
  resetToolForm();
};

const previewLogoUrl = computed(() => {
  return toolForm.logo_url || "";
});

const logoValid = ref(true);
const checkLogoUrl = () => {
  if (toolForm.logo_url) {
    const img = new Image();
    img.onload = () => {
      logoValid.value = true;
    };
    img.onerror = () => {
      logoValid.value = false;
    };
    img.src = toolForm.logo_url;
  } else {
    logoValid.value = false;
  }
};

// 监听logo_url变化
watch(
  () => toolForm.logo_url,
  () => {
    checkLogoUrl();
  }
);

// 提交添加工具
const submitAddTool = () => {
  toolFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 使用Element Plus的loading服务
        const loadingInstance = ElLoading.service({
          lock: true,
          text: "正在添加工具...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        await adminStore.addTool(
          toolForm.name,
          toolForm.category,
          toolForm.url,
          toolForm.logo_url,
          toolForm.description
        );

        loadingInstance.close();
        addToolDialogVisible.value = false;
        resetToolForm();

        // 重新加载分类和工具
        await refreshTools();

        ElMessage({
          type: "success",
          message: "工具添加成功！",
          duration: 2000,
        });
      } catch (error: any) {
        ElMessage.error(`添加失败：${error.message || "未知错误"}`);
      }
    } else {
      ElMessage.warning("请正确填写所有必填信息");
      return false;
    }
  });
};

// 处理工具选择
const handleSelect = (item: any) => {
  selectedTool.value = item;
  currentPage.value = 1; // 重置页码
  console.log("选中工具:", item);
};

// 取消选中工具
const clearSelection = () => {
  selectedTool.value = null;
  state.value = "";
  currentPage.value = 1; // 重置页码
};

// 搜索建议
let timeout: ReturnType<typeof setTimeout>;
const querySearchAsync = (
  queryString: string,
  callback: (arg: any) => void
) => {
  const results = queryString
    ? toolsList.value.filter(createFilter(queryString))
    : toolsList.value;
  const formattedResults = results.map((tool) => ({
    value: tool.name,
    ...tool,
  }));
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    callback(formattedResults);
  }, 300);
};

// 搜索过滤器
const createFilter = (queryString: string) => {
  return (tool: any) => {
    return (
      tool.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0 ||
      tool.category.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

onMounted(async () => {
  await toolsStore.fetchCategory();
  total.value = toolsList.value.length;
});
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
.before-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
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

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 50px;
}

.refresh-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(30deg) scale(1.1);
    box-shadow: 0 0 10px rgba(64, 158, 255, 0.4);
  }

  &:active {
    transform: rotate(180deg) scale(0.9);
  }
}

.add {
  transform: scale(0.9);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(0.95);
  }

  &:active {
    transform: scale(0.85);
  }
}

// 搜索
.search {
  width: 40%;
  display: flex;
  align-items: center;

  .el-icon {
    margin-right: 5px;
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

/* 添加工具表单样式 */
.tool-form {
  margin: 0 20px;

  .el-form-item {
    margin-bottom: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(1px);
    }
  }
}

.preview-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-preview {
  text-align: center;
  margin-top: 20px;

  p {
    margin-bottom: 10px;
    color: #606266;
    font-size: 14px;
  }

  .preview-container {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #f5f7fa;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
      transform: scale(1.05);
    }
  }

  .preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: all 0.3s ease;
  }

  .placeholder-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 12px;

    span {
      margin-top: 8px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  gap: 10px;
}

:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  .el-dialog__header {
    background-color: #f5f7fa;
    padding: 15px 20px;
    margin: 0;
    border-bottom: 1px solid #ebeef5;

    .el-dialog__title {
      font-weight: 600;
      font-size: 16px;
      color: #303133;
    }

    .el-dialog__headerbtn {
      top: 15px;
    }
  }

  .el-dialog__body {
    padding: 25px 0;
  }

  .el-dialog__footer {
    border-top: 1px solid #ebeef5;
    padding: 15px 20px;
    margin: 0;
  }
}

:deep(.el-input__wrapper) {
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset,
      0 0 10px rgba(64, 158, 255, 0.2) !important;
    transform: translateY(-2px);
  }
}
</style>
