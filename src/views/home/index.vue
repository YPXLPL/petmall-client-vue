<script setup>
import HomeBanner from '@/views/home/components/HomeBanner.vue'
import HomeCoupons from '@/views/home/components/HomeCoupons.vue'
import HomeBrand from '@/views/home/components/HomeBrand.vue'
import HomeCategory from '@/views/home/components/HomeCategory.vue'
import HomeGoods from '@/views/home/components/HomeGoods.vue'
import HomeServiceAdvertising from '@/views/home/components/HomeServiceAdvertising.vue'
import HomeBlog from '@/views/home/components/HomeBlog.vue'
document.body.scrollTop = 0
</script>

<template>
  <div class="container">
    <HomeBanner></HomeBanner>
  </div>
  <HomeCategory></HomeCategory>
  <HomeCoupons></HomeCoupons>
  <HomeGoods title="狗狗商品" :catSubType="0"> </HomeGoods>
  <HomeBrand :pageNum="1"></HomeBrand>
  <HomeGoods title="猫猫用品" :catSubType="1"> </HomeGoods>
  <HomeBrand :pageNum="2"></HomeBrand>
  <HomeServiceAdvertising></HomeServiceAdvertising>
  <HomeBlog></HomeBlog>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin: 0 auto;
  background-color: $yellowColor;
  display: flex;
  height: 665px;
}
</style>
