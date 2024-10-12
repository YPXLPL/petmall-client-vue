<script setup>
import blog1Img from '@/assets/blog-1.jpg'
</script>

<template>
  <div class="our-blog">
    <div class="title">
      <h3>来自我们的博客</h3>
    </div>
    <div class="container">
      <ul class="our-blog-items">
        <li class="our-blog-item" v-for="item in 3" :key="item">
          <div class="img">
            <RouterLink to="">
              <el-image :src="blog1Img"></el-image>
            </RouterLink>
          </div>
          <div class="content">
            <div class="blog-author-date">
              <span>By: Admin - Sep 14, 2018</span>
            </div>
            <div class="blog-title ellipsis-2">
              <h4>
                <RouterLink to=""> Lorem ipsum dolor sit amet consectetur adipisicing elit. </RouterLink>
              </h4>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.our-blog {
  background-color: #fff;
  padding-bottom: 100px;
}
.our-blog-items {
  display: flex;
  justify-content: space-between;
}

.our-blog-item {
  background-color: #f6f6f6;
  width: 370px;
  height: 380px;
  .img {
    position: relative;
  }
  .el-image::before {
    left: -100%;
    top: -100%;
    background-color: rgba(255, 255, 255, 0.1);
    content: '';
    height: 100%;
    position: absolute;
    transition: 0.3s all ease;
    width: 100%;
    z-index: 8;
    display: block;
  }

  .el-image::after {
    position: absolute;
    bottom: -100%;
    right: -100%;
    background-color: rgba(255, 255, 255, 0.1);
    content: '';
    height: 100%;
    position: absolute;
    transition: all 0.3s ease 0s;
    width: 100%;
    z-index: 8;
    display: block;
  }
  &:hover .el-image::before {
    top: 0;
    left: 0;
  }
  &:hover .el-image::after {
    bottom: 0;
    right: 0;
  }
  .content {
    padding: 26px 30px;
    .blog-author-date {
      margin-bottom: 10px;
      color: #575757;
      display: inline-block;
      list-style: outside none none;
      position: relative;
    }
    .blog-title {
      a {
        transition: 0.3s all ease;
        font-family: 'dingding', sans-serif;
        color: #343434;
        font-size: 20px;
        line-height: 30px;
      }
      a:hover {
        color: $primaryColor;
      }
    }
  }
}
</style>
