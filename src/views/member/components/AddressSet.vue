<script setup>
import AddOrUpdateAddressDialog from '@/components/AddOrUpdateAddressDialog.vue'
import {
  getAddressListApi,
  deleteAddressByIdApi,
  deleteBatchAddressByIdsApi,
  updateDefaultStatusByIdApi,
  updateCurAddressByIdApi
} from '@/api/member'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { ElMessageBox } from 'element-plus'
import { message } from '@/utils/resetMessage'
const userStore = useUserStore()
const addOrUpdateAddressDialogRef = ref()
const addOrUpdateAddress = (id) => {
  addOrUpdateAddressDialogRef.value.init(id)
}
const addressList = ref([])
const getAddressList = async () => {
  const res = await getAddressListApi()
  addressList.value = res.data
}
getAddressList()
const deleteAddressById = (id) => {
  console.log(id, userStore.user.id)
  ElMessageBox.confirm('你确定要删除这个收获地址吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteAddressByIdApi(id, userStore.user.id)
      message.success(res.msg)
      getAddressList()
    })
    .catch(() => {})
}

const hasDeleteItem = ref(true)
const batchAddressList = ref([])
const selectionChangeHandler = (checkBoxs) => {
  if (checkBoxs.length === 0) {
    hasDeleteItem.value = true
  } else {
    hasDeleteItem.value = false
  }
  batchAddressList.value = checkBoxs
}
const deleteBatchAddressByIds = () => {
  if (batchAddressList.value.length > 0) {
    const ids = batchAddressList.value.map((item) => item.id)
    ElMessageBox.confirm('你确定要进行批量删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        const res = await deleteBatchAddressByIdsApi(ids, userStore.user.id)
        message.success(res.msg)
        getAddressList()
      })
      .catch(() => {})
  }
}
const refreshHandler = () => {
  getAddressList()
}

const changeRadioButton = async (val) => {
  const res = await updateDefaultStatusByIdApi(val.id, userStore.user.id)
  message.success(res.msg)
  getAddressList()
}

const changeSelectAddressRadioButton = async (val) => {
  await updateCurAddressByIdApi(val.id, userStore.user.id)
  getAddressList()
}
</script>

<template>
  <div class="address-set">
    <div>
      <div class="control-address">
        <button class="delete-btn" :disabled="hasDeleteItem" @click.prevent="deleteBatchAddressByIds">批量删除</button>
        <button class="btn" @click.prevent="addOrUpdateAddress()">添加收货地址</button>
      </div>
    </div>
    <el-table
      class="address-table"
      :data="addressList"
      @selection-change="selectionChangeHandler"
      :height="addressList.length > 8 ? '540' : 'auto'"
    >
      <el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column>
      <el-table-column type="index" width="100" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column
        label="收货人姓名"
        prop="name"
        width="150"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column label="手机号" prop="phone" width="160" header-align="center" align="center"></el-table-column>
      <el-table-column label="详细地址" prop="detailAddress" header-align="center" align="center"></el-table-column>
      <el-table-column label="默认地址" width="140" prop="defaultStatus" header-align="center" align="center">
        <template #default="scope">
          <el-radio-group v-model="scope.row.defaultStatus" @change="changeRadioButton(scope.row)">
            <el-radio :label="true" size="large">默认</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="收货地址" width="140" header-align="center" align="center">
        <template #default="scope">
          <el-radio-group v-model="scope.row.curAddress" @change="changeSelectAddressRadioButton(scope.row)">
            <el-radio :label="true" size="large" border>选择地址</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" header-align="center" align="center">
        <template #default="scope">
          <el-button type="info" :icon="Edit" circle @click="addOrUpdateAddress(scope.row.id)" />
          <el-button type="danger" :icon="Delete" circle @click="deleteAddressById(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <AddOrUpdateAddressDialog ref="addOrUpdateAddressDialogRef" @refresh="refreshHandler"></AddOrUpdateAddressDialog>
</template>

<style lang="scss" scoped>
.address-set {
  margin-top: 30px;
  .control-address {
    padding: 10px 0;
    display: flex;
    justify-content: right;
    .delete-btn {
      margin-right: 20px;
      font-family: 'dingding', sans-serif;
      font-size: 16px;
      letter-spacing: 2px;
      cursor: pointer;
      background-color: $dangerColor;
      color: #fff;
      border: 0;
      width: 120px;
      height: 35px;
      border-radius: 10px;
      transition: 0.3s all ease;
      &:hover {
        background-color: #8f0606;
      }
      &[disabled] {
        cursor: not-allowed;
        background-color: #961616;
        color: #ccc;
      }
    }
    .btn {
      font-family: 'dingding', sans-serif;
      font-size: 16px;
      letter-spacing: 2px;
      cursor: pointer;
      background-color: $primaryColor;
      color: #fff;
      border: 0;
      width: 150px;
      height: 35px;
      border-radius: 10px;
      transition: 0.3s all ease;
      &:hover {
        background-color: #333;
      }
    }
  }
}
</style>
