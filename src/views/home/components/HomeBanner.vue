<script setup>
import { getBannerListApi } from '@/api/banner'
import { nextTick, ref } from 'vue'
const bannerList = ref([])
const currentBanner = ref({})
const currentIndex = ref(0)
const active = ref(true)
const itemList = ref([])
const setRef = (el) => {
  itemList.value.push(el)
}
const getBannerList = async () => {
  const res = await getBannerListApi()
  bannerList.value = res.data
  currentBanner.value = bannerList.value[0]
  nextTick(() => {
    itemList.value[0].classList.add('active')
  })
}
getBannerList()

const bannerPrevHandler = () => {
  active.value = false
  currentIndex.value--
  if (currentIndex.value < 0) {
    currentIndex.value = bannerList.value.length - 1
  }
  currentBanner.value = bannerList.value[currentIndex.value]
  for (let i = 0; i < itemList.value.length; i++) {
    itemList.value[i].classList.remove('active')
  }
  itemList.value[currentIndex.value].classList.add('active')
  nextTick(() => {
    active.value = true
  })
}

const bannerNextHandler = () => {
  active.value = false
  currentIndex.value++
  if (currentIndex.value > bannerList.value.length - 1) {
    currentIndex.value = 0
  }
  currentBanner.value = bannerList.value[currentIndex.value]
  for (let i = 0; i < itemList.value.length; i++) {
    itemList.value[i].classList.remove('active')
  }
  itemList.value[currentIndex.value].classList.add('active')
  nextTick(() => {
    active.value = true
  })
}

const changeBannerHandler = (index) => {
  const elIndex = itemList.value.findIndex((item) => item.classList.contains('active'))
  if (elIndex === index) {
    return
  }
  active.value = false
  for (let i = 0; i < itemList.value.length; i++) {
    itemList.value[i].classList.remove('active')
  }
  itemList.value[index].classList.add('active')
  currentBanner.value = bannerList.value[index]
  currentIndex.value = index
  nextTick(() => {
    active.value = true
  })
}
</script>
<template>
  <div class="banner" @mouseenter="setListItemHandler">
    <button class="arrow-prev" @click="bannerPrevHandler">
      <el-icon><ArrowLeft /></el-icon>
    </button>
    <button class="arrow-next" @click="bannerNextHandler">
      <el-icon><ArrowRight /></el-icon>
    </button>
    <div class="banner-container">
      <el-row class="row">
        <el-col :span="12" class="left" v-if="active">
          <h3 class="title title-active">{{ currentBanner.title }}</h3>
          <h1 class="subTitle subTitle-active">{{ currentBanner.subTitle }}</h1>
          <div class="btn btn-active">
            <RouterLink to="">前&nbsp;&nbsp;往</RouterLink>
          </div>
        </el-col>
        <el-col :span="12" class="right" v-if="active">
          <div class="img img-active">
            <el-image :src="currentBanner.imgUrl"></el-image>
          </div>
        </el-col>
      </el-row>
    </div>
    <ul class="bottom-list">
      <li
        class="btn-item"
        v-for="(item, index) in bannerList"
        :key="item.id"
        :ref="setRef"
        @mouseenter="changeBannerHandler(index)"
      ></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.banner {
  margin: 0 auto;
  width: 100%;
  height: 665px;
  padding-top: 50px;
  padding-bottom: 50px;

  // 底部按钮列表
  .bottom-list {
    margin: 0 auto;
    display: flex;
    align-items: center;
    width: 210px;
    height: 10px;
    opacity: 0;
    transition: all 0.3s ease 0s;
    .btn-item {
      cursor: pointer;
      width: 40px;
      height: 4px;
      margin-left: 10px;
      background-color: rgba(163, 162, 162, 0.9);
      transition: all 0.3s ease 0s;
    }

    .active {
      opacity: 1;
      background-color: #7e4c4f;
    }
  }
  &:hover {
    .bottom-list {
      opacity: 1;
    }
    .arrow-prev {
      opacity: 1;
    }
    .arrow-next {
      opacity: 1;
    }
  }
  .arrow-prev {
    position: absolute;
    top: 50%;
    background-color: #fff;
    border: 1px solid #ececec;
    border-radius: 50px;
    color: #333;
    font-size: 17px;
    height: 48px;
    left: 15px;
    line-height: 49px;
    opacity: 0;
    text-align: center;
    transform: translateY(-50%);
    transition: all 0.3s ease 0s;
    width: 48px;
    cursor: pointer;
  }

  .arrow-next {
    position: absolute;
    right: 15px;
    background-color: #fff;
    border: 1px solid #ececec;
    border-radius: 50px;
    color: #333;
    font-size: 17px;
    height: 48px;
    line-height: 49px;
    opacity: 0;
    position: absolute;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.3s ease 0s;
    width: 48px;
    cursor: pointer;
  }

  .arrow-prev:hover {
    background-color: #000;
    color: #fff;
  }

  .arrow-next:hover {
    background-color: #000;
    color: #fff;
  }
}
.banner-container {
  margin: 0 auto;
  width: 1000px;
  height: 565px;
}

.row {
  width: 1000px;
  margin: 0 auto;
  height: 565px;
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translate3d(50%, 0, 0);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}
.left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  .title-active {
    animation-delay: 0.7s;
    animation-duration: 1.3s;
    animation-fill-mode: both;
    animation-name: fadeInLeft;
  }
  .subTitle-active {
    animation-delay: 1s;
    animation-duration: 1.3s;
    animation-fill-mode: both;
    animation-name: fadeInLeft;
  }
  .btn-active {
    animation-name: fadeInLeft;
    animation-delay: 1.6s;
    animation-duration: 1.3s;
    animation-fill-mode: both;
  }
  .title {
    font-family: 'dingding', sans-serif;
    font-size: 50px;
    font-weight: 400;
    line-height: 61px;
    margin: 0;
    color: #000101;
  }
  .subTitle {
    font-family: 'Montserrat', sans-serif;
    color: #000000;
    font-size: 60px;
    font-weight: bold;
    line-height: 80px;
    margin: 18px 0 31px;
  }
  .btn {
    a {
      text-align: center;
      background-color: #7e4c4f;
      width: 175px;
      height: 54px;
      border-radius: 50px;
      font-size: 16px;
      color: #fff;
      display: inline-block;
      font-weight: bold;
      line-height: 50px;
      transition: 0.3s all linear;
    }

    a:hover {
      background-color: rgba(0, 0, 0, 0.9);
    }
  }
}

.right {
  display: flex;
  align-items: center;
  .img {
    .el-image {
      transition: 0.3s all ease;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    .el-image:hover {
      transform: scale(1.05);
    }
  }
  .img-active {
    animation-name: fadeInRight;
    animation-delay: 1.6s;
    animation-duration: 1s;
    animation-fill-mode: both;
  }
}
</style>
