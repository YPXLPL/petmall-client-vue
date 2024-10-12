<script setup>
import { ref } from 'vue'
import { regionData } from 'element-china-area-data'
const city = ref([])
const props = ref({
  value: 'label',
  label: 'label',
  children: 'children'
})
const emit = defineEmits(['change', 'clear'])
const selectCategory = (val) => {
  city.value = val
}
const clear = () => {
  city.value = []
}
const handleChange = (val) => {
  emit('change', val)
}
defineExpose({
  clear,
  selectCategory
})
</script>
<template>
  <el-cascader v-model="city" :options="regionData" :props="props" @change="handleChange" placeholder="请选择地址" />
</template>

<style lang="scss" scoped></style>
