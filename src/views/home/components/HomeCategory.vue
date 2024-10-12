<script setup>
import { categoryMenuLevel1Api } from '@/api/category'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const categoryLevel1List = ref([])
const categoryMenuLevel1 = async () => {
  const res = await categoryMenuLevel1Api()
  categoryLevel1List.value = res.data
}
categoryMenuLevel1()

const router = useRouter()
const goToSearch = (catId) => {
  router.push(`/search?keyWord=&category1Id=${catId}`)
}
</script>

<template>
  <div class="category">
    <div class="category-container container">
      <ul class="category-items">
        <li class="category-item" v-for="item in categoryLevel1List" :key="item.catId">
          <div class="cat-img">
            <div class="mask-layer">
              <button class="btn" @click="goToSearch(item.catId)">浏&nbsp;览</button>
            </div>
            <el-image class="img" :src="item.logo"></el-image>
          </div>
          <div class="cat-name">
            <h3>{{ item.name }}</h3>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category {
  background-color: #fff;
  padding-top: 50px;
  padding-bottom: 30px;
}
.category-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .category-item {
    width: 400px;
    height: 350px;
    position: relative;
  }

  .cat-img:hover {
    .mask-layer {
      opacity: 1;
      transform: none;
    }
  }

  .mask-layer {
    position: absolute;
    width: 400px;
    height: 276px;
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
      height: 70px;
      cursor: pointer;
      background-color: rgba($color: $yellowColor, $alpha: 0.9);
      border-radius: 50px;
      border: 0;
      color: #000;
      font-size: 20px;
      font-family: 'dingding', sans-serif;
    }

    .btn:hover {
      background-color: rgba($color: $primaryColor, $alpha: 0.9);
      color: #fff;
    }
  }
  .cat-name {
    margin: -30px 0 0;
    position: relative;
    z-index: 99;
    text-align: center;
    h3 {
      padding: 15px 74px 27px;
      background-color: #fff;
      border-radius: 50px;
      box-shadow: 0 0.3px 7px rgba(0, 0, 0, 0.2);
      color: #000101;
      display: inline-block;
      font-family: 'dingding', sans-serif;
      font-size: 30px;
      line-height: 1;
    }
  }
  .cat-img {
    height: 276px;
    .img {
      width: 400px;
      height: 276px;
    }
  }
}
</style>
