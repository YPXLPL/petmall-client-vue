<script setup>
import PageHeader from '@/components/PageHeader.vue'
import CheckOut from '@/views/checkout/components/CheckOut.vue'
document.body.scrollTop = 0
</script>

<template>
  <PageHeader :title="'订单确认'"></PageHeader>
  <CheckOut></CheckOut>
</template>

<style lang="scss" scoped></style>
