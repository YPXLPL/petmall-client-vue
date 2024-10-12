<script setup></script>
<template>
  <el-backtop :bottom="50">
    <div class="scrollUp">
      <i class="iconfont icon-a-xiangshangjiantou"></i>
    </div>
  </el-backtop>
</template>

<style lang="scss" scoped>
.scrollUp {
  background: #7e4c4f none repeat scroll 0 0;
  color: #fff;
  line-height: 40px;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: 0.3s all ease;
  .iconfont {
    font-size: 23px;
  }
  &:hover {
    background-color: #333;
  }
}
</style>
