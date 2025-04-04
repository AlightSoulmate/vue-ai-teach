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
    <div class="add">
      <Add v-model="text" />
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
        width="160"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="category"
        label="分类"
        width="120"
        header-align="center"
        align="center"
        sortable="custom"
        :filters="categoryFilters"
        :filter-method="filterCategory"
      />
      <el-table-column
        prop="description"
        label="描述"
        min-width="200"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="score"
        label="评分"
        width="100"
        header-align="center"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }"> {{ row.score ?? "暂无" }} ⭐ </template>
      </el-table-column>
      <el-table-column
        prop="ratingCount"
        label="评分数"
        width="100"
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
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useToolsStore } from "@/stores/useToolsStore";
import { Search } from "@element-plus/icons-vue";
// @ts-ignore
import Add from "@/pages/admin/component/button.vue";

const toolsStore = useToolsStore();
const currentPage = ref(1);
const pageSize = ref(13);
const total = ref(0);
const state = ref("");
const text = ref("添加新工具");
const selectedTool = ref<any>(null);

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

const handleNameUpdate = (row: any) => {
  ElMessageBox.prompt("请输入新名称", "修改工具名称", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{2,50}$/,
    inputErrorMessage: "名称长度必须在2-50位之间",
  })
    .then(({ value }) => {
      if (value) {
        // TODO: 调用更新工具名称的 API
        ElMessage.success("修改成功");
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
  })
    .then(({ value }) => {
      if (value) {
        // TODO: 调用更新工具描述的 API
        ElMessage.success("修改成功");
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
  })
    .then(({ value }) => {
      if (value) {
        // TODO: 调用更新工具分类的 API
        ElMessage.success("修改成功");
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
    .then(() => {
      // TODO: 调用删除工具的 API
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
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
