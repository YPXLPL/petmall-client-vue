<script setup>
import { Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { policy } from '@/api/policy.js'
import { ElMessage } from 'element-plus'
const getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}

const props = defineProps({
  modelValue: Array,
  count: Number,
  showFile: {
    type: Boolean,
    default: true
  },
  fileLocation: String
})

const maxCount = computed(() => {
  let count = 0
  if (props.count) {
    count = props.count
  } else {
    count = 15
  }
  return count
})

const uploadData = ref({
  policy: '',
  signature: '',
  key: '',
  ossaccessKeyId: '',
  dir: '',
  host: '',
  uuid: ''
})
const dialogVisible = ref(false)
const dialogImageUrl = ref(null)

const fileList = computed(() => {
  let fileList = []
  if (props.modelValue) {
    for (let i = 0; i < props.modelValue.length; i++) {
      fileList.push({ url: props.modelValue[i] })
    }
  }
  return fileList
})

const emit = defineEmits(['update:modelValue', 'changeImg', 'clearImg'])
const emitInput = (files) => {
  let value = []
  for (let i = 0; i < files.length; i++) {
    value.push(files[i].url)
  }
  emit('update:modelValue', value)
}
const removeHandler = (file) => {
  fileList.value = fileList.value.filter((item) => file.url === item.url)
  emitInput(fileList.value)
  emit('clearImg', file.url)
}

const uploadRef = ref()
const changeHandler = async (file) => {
  if (file.status === 'ready') {
    const res = await policy()
    uploadData.value.policy = res.data.policy
    uploadData.value.signature = res.data.signature
    uploadData.value.ossaccessKeyId = res.data.accessid
    uploadData.value.key = res.data.dir + 'product/' + props.fileLocation + '/' + getUUID() + `_${file.name}`
    uploadData.value.dir = res.data.dir
    uploadData.value.host = res.data.host
    uploadRef.value.submit()
  }
  if (file.status === 'success') {
    fileList.value.push({
      name: file.name,
      url: uploadData.value.host + '/' + uploadData.value.key.replace('fileName', file.name)
    })
    emitInput(fileList.value)
    emit('changeImg')
  }
}

const previewHandler = (file) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}

const onExceedHandler = () => {
  ElMessage.warning(`最多只能上传${maxCount.value}张图片`)
}
</script>

<template>
  <div>
    <el-upload
      ref="uploadRef"
      action="http://petmall-ypx.oss-cn-guangzhou.aliyuncs.com"
      :data="uploadData"
      list-type="picture-card"
      :on-success="successHandler"
      :on-remove="removeHandler"
      :file-list="fileList"
      :show-file-list="showFile"
      :limit="maxCount"
      :on-exceed="onExceedHandler"
      :on-preview="previewHandler"
      :auto-upload="false"
      :on-change="changeHandler"
    >
      <el-icon>
        <Plus />
      </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
