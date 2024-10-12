<script setup>
import { ref } from 'vue'
import AddressSet from '@/views/member/components/AddressSet.vue'
const visiable = ref(false)
const init = () => {
  visiable.value = true
}
const emit = defineEmits(['refresh'])
const changeCurAddress = () => {
  emit('refresh')
  visiable.value = false
}
defineExpose({
  init
})
</script>
<template>
  <el-dialog
    title="切换地址"
    width="1240"
    v-model="visiable"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :destroy-on-close="true"
  >
    <AddressSet></AddressSet>
    <template #footer>
      <el-button
        type="primary"
        @click="changeCurAddress"
        style="width: 100px; letter-spacing: 2px; font-family: 'dingding', sans-serif"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
