<script setup>
import { computed, ref } from 'vue'
import { policy } from '@/api/policy.js'
import { message } from '@/utils/resetMessage.js'
const getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  fileLocation: String
})
const uploadData = ref({
  policy: '',
  signature: '',
  ossaccessKeyId: '',
  key: '',
  dir: '',
  host: ''
})
const dialogVisible = ref(false)

const imgUrl = computed(() => {
  return props.url || ''
})

const imgName = computed(() => {
  if (props.url !== '') {
    return props.url.substring(props.url.lastIndexOf('/') + 1)
  } else {
    return ''
  }
})

const fileList = computed(() => {
  if (imgUrl.value === '' || imgName.value === '') {
    return []
  } else {
    return [
      {
        name: imgName.value,
        url: imgUrl.value
      }
    ]
  }
})

const showFileList = computed(() => {
  return props.url || ''
})
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
    showFileList.value = true
    fileList.value.pop()
    fileList.value.push({
      name: file.name,
      url: uploadData.value.host + '/' + uploadData.value.key.replace('fileName', file.name)
    })
    emitInput(fileList.value[0].url)
    message.success('图片上传完成')
  }
}

const removeHandler = () => {
  emitInput('')
}

const emit = defineEmits(['input'])
const emitInput = (urlStr) => {
  emit('input', urlStr)
}
const previewHandler = () => {
  dialogVisible.value = true
}
</script>

<template>
  <div>
    <el-upload
      ref="uploadRef"
      action="http://petmall-ypx.oss-cn-guangzhou.aliyuncs.com"
      :data="uploadData"
      list-type="picture"
      :on-success="successHandler"
      :on-remove="removeHandler"
      :file-list="fileList"
      :on-preview="previewHandler"
      :auto-upload="false"
      :on-change="changeHandler"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <template #tip>
        <span style="margin-left: 10px" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</span>
      </template>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped></style>
