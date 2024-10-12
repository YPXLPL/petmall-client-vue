<script setup>
import couponsBanner from '@/assets/img/coupons-banner.png'
</script>
<template>
  <div class="coupons">
    <div class="coupons-container container">
      <div class="mask-layer">
        <button class="btn">前&nbsp;往</button>
      </div>
      <el-image :src="couponsBanner"></el-image>
      <div class="coupons-text">优惠中心</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.coupons {
  background-color: #fff;
  padding-bottom: 50px;
  margin-bottom: 100px;
  &-container {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('@/assets/img/coupons-banner-bg.png');
    background-size: cover;
    background-position: 0px -200px;
    .coupons-text {
      color: #fff;
      position: absolute;
      font-family: 'dingding', sans-serif;
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 50px;
    }

    .el-image {
      height: 120px;
      width: 1000px;
    }
  }

  &-container:hover {
    .mask-layer {
      opacity: 1;
      transform: none;
    }
  }

  .mask-layer {
    position: absolute;
    width: 1240px;
    height: 100px;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.4);
    transform: scale(0.3);
    transition: 0.3s all ease;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      transition: 0.3s all linear;
      width: 150px;
      height: 50px;
      cursor: pointer;
      background-color: rgba($color: $yellowColor, $alpha: 0.9);
      border-radius: 50px;
      border: 0;
      color: #000;
      font-size: 25px;
      font-family: 'dingding', sans-serif;
    }

    .btn:hover {
      background-color: rgba($color: $primaryColor, $alpha: 0.9);
      color: #fff;
    }
  }
}
</style>
