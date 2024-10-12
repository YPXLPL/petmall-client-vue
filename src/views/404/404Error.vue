<script setup>
import logo from '@/assets/img/logo2.png'
</script>
<template>
  <div class="error container">
    <div class="logo-container">
      <RouterLink to="/home" :replace="true"> <el-image fit="contain" :src="logo" class="logo"></el-image></RouterLink>
      <h1 class="content">提醒您，遇到问题了，链接找不到哦！</h1>
    </div>
    <i class="iconfont icon-icon-test"></i>
    <div class="content"><h3>你想要的页面丢失了</h3></div>
    <button @click.prevent="$router.replace('/')" class="back-button">回到商城</button>
  </div>
</template>

<style lang="scss" scoped>
.error {
  background-color: #fff;
}
.error {
  width: 100%;
  height: 100vh;
  background-color: #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .logo-container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
  }

  .content {
    font-family: 'dingding', sans-serif;
    font-size: 40px;
  }

  .iconfont {
    font-size: 150px;
    color: $primaryColor;
  }

  .back-button {
    margin-top: 20px;
    background-color: $primaryColor;
    color: #fff;
    border: 0;
    width: 150px;
    height: 50px;
    cursor: pointer;
    font-family: 'dingding', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    border-radius: 10px;
    transition: 0.3s all ease;
    &:hover {
      background-color: #333;
    }
  }
}
</style>
