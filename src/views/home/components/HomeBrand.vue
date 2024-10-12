<script setup>
import { getHomeBrandListApi } from '@/api/brand'
import { ref } from 'vue'
const props = defineProps({
  pageNum: {
    require: true,
    type: Number
  }
})
const homeBrandList = ref([])
const getHomeBrandList = async () => {
  const res = await getHomeBrandListApi(props.pageNum)
  homeBrandList.value = res.data
}
getHomeBrandList()
</script>
<template>
  <div class="brands">
    <div class="brands-container container">
      <ul class="brand-items">
        <li class="brand-item" v-for="item in homeBrandList" :key="item.brandId">
          <RouterLink :to="`/brand-goods/${item.brandId}`">
            <el-image :src="item.logo" fit="fill"></el-image>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.brands {
  margin-top: 20px;
  margin-bottom: 100px;
  &-container {
    box-shadow: 0px 7px 7px 10px rgba(56, 56, 56, 0.05);
    background-color: #fff;
    border-radius: 10px;
  }
  .brand-items {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .brand-item:nth-child(2n):not(:nth-child(2n-1)) {
    margin: 0 25px;
  }
  .brand-item {
    a {
      border: 1px solid #ececec;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 160px;
      height: 72px;
      flex-shrink: 0;
      border-radius: 4px;
      .el-image {
        height: 70px;
      }
    }
  }
}
</style>
