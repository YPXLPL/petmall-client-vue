<script setup>
import PageHeader from '@/components/PageHeader.vue'
import { getBrandListApi } from '@/api/brand.js'
import { ref } from 'vue'
const brandList = ref([])
const loading = ref(false)
const getBrandList = async () => {
  loading.value = true
  const res = await getBrandListApi()
  brandList.value = res.data
  loading.value = false
}
getBrandList()
</script>

<template>
  <PageHeader title="品牌馆"></PageHeader>
  <div class="brand" v-loading="loading">
    <div class="brand-container">
      <ul class="brand-items">
        <li class="brand-item" v-for="item in brandList" :key="item.brandId">
          <RouterLink :to="`/brand-goods/${item.brandId}`">
            <el-image :src="item.logo"></el-image>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.brand {
  padding-top: 100px;
  padding-bottom: 50px;
  background-color: #fff;
  &-container {
    margin: 0 auto;
    width: 1240px;
  }
  &-items {
    margin: 0 auto;
    width: 1030px;
    display: flex;
    flex-wrap: wrap;
  }
  &-item:nth-child(n + 7) {
    margin-top: 10px;
  }
  &-item {
    display: flex;
    justify-content: center;
    width: 170px;
    .el-image {
      border: 1px solid #ccc;
      width: 150px;
      height: 70px;
      transition: 0.3s all ease;
      &:hover {
        box-shadow: 0px 0px 7px rgb(56, 56, 56);
      }
    }
  }
}
</style>
