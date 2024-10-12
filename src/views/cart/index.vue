<script setup>
import PageHeader from '@/components/PageHeader.vue'
import CartDetail from '@/views/cart/components/CartDetail.vue'
document.body.scrollTop = 0
</script>

<template>
  <PageHeader :title="'购物车'"></PageHeader>
  <CartDetail></CartDetail>
</template>

<style lang="scss" scoped></style>
