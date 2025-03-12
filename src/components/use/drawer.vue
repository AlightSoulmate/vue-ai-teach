<!-- <template>
  <el-drawer
    v-model="drawer"
    title="I am the title"
    :direction="direction"
    :before-close="handleClose"
  >
    <span>Hi, there!</span>
  </el-drawer>
  <el-drawer v-model="drawer2" :direction="direction">
    <template #header>
      <h4>set title by slot</h4>
    </template>
    <template #default>
      <div>
        <el-radio v-model="radio1" value="Option 1" size="large">
          Option 1
        </el-radio>
        <el-radio v-model="radio1" value="Option 2" size="large">
          Option 2
        </el-radio>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import type { DrawerProps } from "element-plus";

const drawer = ref(false);
const drawer2 = ref(false);
const direction = ref<DrawerProps["direction"]>("rtl");
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("确定关闭?")
    .then(() => {
      done();
    })
    .catch(() => {});
};
function cancelClick() {
  drawer2.value = false;
}
function confirmClick() {
  ElMessageBox.confirm(`确定选择 ${radio1.value} ?`)
    .then(() => {
      drawer2.value = false;
    })
    .catch(() => {});
}
</script>
<style lang="scss" scoped></style> -->
