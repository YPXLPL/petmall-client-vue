<script setup>
import ProductDetail from '@/views/detail/components/ProductDetail.vue'
import PageHeader from '@/components/PageHeader.vue'
document.body.scrollTop = 0
</script>

<template>
  <PageHeader :title="'商品详情'"></PageHeader>
  <ProductDetail></ProductDetail>
</template>

<style lang="scss" scoped></style>
