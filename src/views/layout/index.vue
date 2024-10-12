<script setup>
import LayoutTopNav from '@/views/layout/components/LayoutTopNav.vue'
import LayoutHeader from '@/views/layout/components/LayoutHeader.vue'
import LayoutFooter from '@/views/layout/components/LayoutFooter.vue'
import LayoutScrollUp from '@/views/layout/components/LayoutScrollUp.vue'
</script>
<template>
  <LayoutTopNav></LayoutTopNav>
  <LayoutScrollUp></LayoutScrollUp>
  <LayoutHeader></LayoutHeader>
  <RouterView></RouterView>
  <LayoutFooter></LayoutFooter>
</template>

<style lang="scss" scoped></style>
