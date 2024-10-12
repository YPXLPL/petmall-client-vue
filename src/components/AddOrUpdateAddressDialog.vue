<script setup>
import { nextTick, ref } from 'vue'
import ProvinceCascader from '@/views/common/ProvinceCascader.vue'
import { saveAddressApi, updateAddressApi, getAddressByIdApi } from '@/api/member'
import { ElMessageBox } from 'element-plus'
import { message } from '@/utils/resetMessage'
const visible = ref(false)
const formData = ref({
  id: '',
  name: '',
  phone: '',
  province: '',
  city: '',
  region: '',
  detailAddress: '',
  defaultStatus: false
})
const rules = ref({
  name: [
    { required: true, message: '收货人姓名不能为空', trigger: 'blur' },
    { max: 50, message: '收货人姓名不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9][0-9]{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
  ],
  address: [
    {
      validator: (rule, value, callback) => {
        if (address.value.length === 0) {
          callback(new Error('地址不能为空'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  detailAddress: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { max: 150, message: '详细地址不能超过150个字符', trigger: 'blur' }
  ]
})
const formRef = ref()
const init = (id) => {
  visible.value = true
  formData.value.id = id || ''
  if (formData.value.id === '') {
    nextTick(() => {
      address.value = []
      resetForm()
    })
  } else {
    getAddressById()
  }
}
const resetForm = () => {
  formData.value = {
    id: '',
    name: '',
    phone: '',
    province: '',
    city: '',
    region: '',
    detailAddress: '',
    defaultStatus: 0
  }
}
const provinceCascaderRef = ref()
const getAddressById = async () => {
  const res = await getAddressByIdApi(formData.value.id)
  formData.value = res.data
  nextTick(() => {
    address.value = [formData.value.province, formData.value.city, formData.value.region]
    provinceCascaderRef.value.selectCategory([formData.value.province, formData.value.city, formData.value.region])
  })
}
const address = ref([])
const changeCascaderHandler = (val) => {
  if (val) {
    address.value = val
    formData.value.province = val[0]
    formData.value.city = val[1]
    formData.value.region = val[2]
  } else {
    address.value = []
    formData.value.province = null
    formData.value.city = null
    formData.value.region = null
  }
}
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (formData.value.id) {
        updateAddress()
      } else {
        saveAddress()
      }
    }
  })
}
const emit = defineEmits(['refresh'])
const saveAddress = () => {
  ElMessageBox.confirm('你要添加这个收货地址吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(async () => {
      const res = await saveAddressApi(formData.value)
      message.success(res.msg)
      emit('refresh')
      visible.value = false
    })
    .catch(() => {})
}
const updateAddress = () => {
  ElMessageBox.confirm('你要修改这个收货地址吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await updateAddressApi(formData.value)
      message.success(res.msg)
      emit('refresh')
      visible.value = false
    })
    .catch(() => {})
}
defineExpose({
  init
})
</script>

<template>
  <el-dialog
    width="900"
    :title="formData.id === '' ? '添加收货地址' : '修改收货地址'"
    align-center
    v-model="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100">
      <el-form-item label="收货人姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入收货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <ProvinceCascader ref="provinceCascaderRef" @change="changeCascaderHandler"></ProvinceCascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input
          v-model="formData.detailAddress"
          type="textarea"
          maxlength="150"
          :max="150"
          show-word-limit
          resize="none"
          :rows="4"
          placeholder="请输入详细地址"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="默认地址" prop="defaultStatus">
        <el-checkbox v-model="formData.defaultStatus"></el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button style="width: 80px" @click="visible = false">取消</el-button>
      <el-button style="width: 80px" type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
