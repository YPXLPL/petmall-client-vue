<script setup>
import logo1 from '@/assets/img/logo1.png'
import logo2 from '@/assets/img/logo2.png'
import menuImg2 from '@/assets/img/menu-img-4.png'
import { ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import { categoryMenuApi } from '@/api/category'
import CartList from '@/views/layout/components/CartList.vue'
import { useUserStore, useCartStore } from '@/stores/index.js'
import { useRouter, useRoute } from 'vue-router'
import { message } from '@/utils/resetMessage'
import { getSuggestionsApi } from '@/api/search'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartNum = ref(0)
const cartStore = useCartStore()
setTimeout(() => {
  if (userStore.token) {
    cartStore.getCartList()
    cartNum.value = cartStore.cartNum
  }
}, 300)
const updateCartListHandler = () => {
  cartStore.getCartList()
}
watch(
  () => cartStore.totalCount,
  () => {
    cartNum.value = cartStore.cartNum
  }
)
watch(
  () => route.fullPath,
  () => {
    showCartListFlag.value = false
  }
)
watch(() => route)
const { y } = useScroll(window)
const showCartListFlag = ref(false)
const showCartListHandler = () => {
  if (!userStore.user.username) {
    message.error('请先登录')
    router.push('/login')
    return
  }
  if (showCartListFlag.value) {
    showCartListFlag.value = false
  } else {
    showCartListFlag.value = true
  }
}
const goToOwnInfoHandler = () => {
  if (!userStore.user.username) {
    message.error('请先登录')
    router.push('/login')
    return
  } else {
    router.push('/member?index=0')
  }
}
const goToCartHandler = () => {
  showCartListFlag.value = false
}
const showSearchStyleFlag = ref(false)
const focusSearchInputHandler = () => {
  showSearchStyleFlag.value = true
  if (suggestionList.value.length > 0) {
    isShowSuggestion.value = true
  } else {
    isShowSuggestion.value = false
  }
}
const blurSearchInputHandler = () => {
  showSearchStyleFlag.value = false
  isShowSuggestion.value = false
}

const categoryList = ref([])
const categoryMenu = async () => {
  const res = await categoryMenuApi()
  categoryList.value = res.data
}
const searchKey = ref('')
const suggestionList = ref([])
const isShowSuggestion = ref(false)
const suggestionHandler = async () => {
  if (searchKey.value) {
    const res = await getSuggestionsApi(searchKey.value)
    suggestionList.value = res.data
    if (suggestionList.value.length > 0) {
      isShowSuggestion.value = true
    } else {
      isShowSuggestion.value = false
    }
  } else {
    suggestionList.value = []
    isShowSuggestion.value = false
  }
}
const selectSuggestionToInputHandler = (item) => {
  searchKey.value = item
  suggestionList.value = []
}
const searchHandler = () => {
  showSearchStyleFlag.value = false
  router.push(`/search?keyWord=${searchKey.value}&pageNum=1`)
}
</script>

<template>
  <div class="top-header">
    <div class="top-header-box" :class="{ stick: y > 140 }">
      <div class="top-header-content">
        <div class="left">
          <RouterLink to="/home">
            <el-image fit="contain" :src="y > 140 ? logo2 : logo1" :class="[y > 140 ? 'logo2' : 'logo1']"></el-image
          ></RouterLink>
        </div>
        <div class="center">
          <div class="top-header-nav">
            <ul class="top-header-nav-items">
              <li class="item">
                <RouterLink to="/home" class="level1-active">首&nbsp;页</RouterLink>
              </li>
              <li class="item dropdown" @mouseenter="categoryMenu()">
                <RouterLink to="" class="level1-active"> 分&nbsp;类</RouterLink>
                <ul class="first-cat-items">
                  <li class="first-cat-item" v-for="first in categoryList" :key="first.catId">
                    <span>{{ first.name }}</span>
                    <ul class="second-cat-items">
                      <li class="second-cat-item" v-for="second in first.childNodes" :key="second.catId">
                        <RouterLink :to="`/search?keyWord=&category2Id=${second.catId}`" class="level2-active"
                          >{{ second.name }}
                        </RouterLink>
                      </li>
                    </ul>
                  </li>
                  <el-image :src="menuImg2" class="img"></el-image>
                </ul>
              </li>
              <li class="item"><RouterLink to="" class="level1-active">优惠券</RouterLink></li>
              <li class="item"><RouterLink to="" class="level1-active">品牌馆</RouterLink></li>
              <li class="item"><RouterLink to="" class="level1-active">博&nbsp;客</RouterLink></li>
            </ul>
          </div>
        </div>
        <div class="right">
          <div class="search" :class="showSearchStyleFlag ? 'show-search-style' : ''">
            <div class="search-icon">
              <el-icon><Search /></el-icon>
            </div>
            <input
              v-model="searchKey"
              @input="suggestionHandler"
              @focus="focusSearchInputHandler"
              @blur="blurSearchInputHandler"
              @keyup.enter="searchHandler"
              type="text"
              placeholder="搜一搜"
            />
            <div class="suggestion" :class="{ showSuggestion: isShowSuggestion }">
              <div class="text">
                <h4>搜索</h4>
                <el-icon class="icon" @click="suggestionList.length = []"><CloseBold /></el-icon>
              </div>
              <ul class="suggestion-items">
                <li
                  class="suggestion-item ellipsis"
                  @click="selectSuggestionToInputHandler(item)"
                  v-for="(item, index) in suggestionList"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="own" @click="goToOwnInfoHandler">
            <el-icon><User /></el-icon>
          </div>
          <div class="cart" @click="showCartListHandler">
            <el-icon class="icon"><Goods /></el-icon>
            <div class="cart-num">
              {{ cartNum <= 99 ? (cartNum < 10 ? (cartNum === 0 ? '0' : `0${cartNum}`) : cartNum) : 99 }}
            </div>
          </div>
        </div>
      </div>
      <CartList
        @updateCartList="updateCartListHandler"
        :cartNum="cartNum"
        @goToCart="goToCartHandler"
        :class="[showCartListFlag ? 'show-layer' : '', { stick: y > 140 }]"
      ></CartList>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.top-header {
  background-color: #fff;
  width: 100%;
  height: 110px;
  &-box {
    height: 110px;
    display: flex;
    align-items: center;
    width: 100%;
  }
  &-content {
    position: relative;
    margin: 0 auto;
    width: 1240px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo1 {
      height: 100px;
      width: 220px;
      background-color: #fff;
    }
    .logo2 {
      width: 110px;
    }
  }

  &-box.stick {
    animation: 0.5s ease-in-out 0s normal none 1 running fadeInDown;
    width: 100%;
    height: 85px;
    background-color: #fff;
    border-bottom: 0;
    box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.06);
    position: fixed;
    top: 0;
    z-index: 899;
    .top-header-nav {
      &-items {
        height: 85px;
        .item {
          .level1-active {
            line-height: 550%;
          }

          .second-cat-item {
            .level2-active {
              line-height: 25px;
              height: 25px;
            }
          }
        }
      }
    }
  }
}
@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate(0, -100%);
    transform: translate(0, -100%);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
.top-header-nav {
  width: 650px;
  &-items {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .item {
      height: 100%;
      .level1-active {
        height: 100%;
        line-height: 650%;
        transition: 0.3s all linear;
        font-size: 16px;
        display: block;
        color: rgb(73, 73, 73);
      }
      .level1-active:hover {
        color: $primaryColor !important;
      }
    }
  }
}

.dropdown {
  position: relative;
  .first-cat-items {
    display: flex;
    z-index: 999;
    position: absolute;
    background: #fff;
    border-top: 1px solid #dcdcdc;
    box-shadow: 0 0 7px 0.5px rgba(0, 0, 0, 0.15);
    left: -150px;
    padding: 30px 30px 34px 0;
    position: absolute;
    text-align: left;
    visibility: hidden;
    top: 110%;
    opacity: 0;
    transition: 0.3s all ease-in-out;
    .first-cat-item {
      font-weight: bold;
      font-size: 16px;
      width: 125px;
      padding-left: 30px;
    }
    .second-cat-items {
      font-weight: 500;
      margin-top: 10px;
    }
    .second-cat-item {
      .level2-active {
        transition: 0.3s all linear;
        font-size: 14px;
        line-height: 25px;
        height: 25px;
        color: rgb(73, 73, 73);
      }
      .level2-active:hover {
        color: $primaryColor !important;
      }
    }
    .img {
      width: 183px;
      height: 213px;
      margin-left: 20px;
      margin-top: 40px;
    }
  }
}
.dropdown:hover {
  .first-cat-items {
    top: 100%;
    opacity: 1;
    visibility: visible;
  }
}

.right {
  width: 300px;
  display: flex;
  align-items: center;
}

.search {
  width: 170px;
  height: 32px;
  border-bottom: 1px solid #e7e7e7;
  line-height: 32px;
  transition: 0.3s all linear;
  position: relative;
  display: flex;
  &-icon {
    font-size: 20px;
    transition: 0.3s all linear;
  }

  input {
    width: 140px;
    padding-left: 5px;
    color: #666;
  }
  &:hover {
    .search-icon {
      color: $primaryColor;
    }
    border-bottom: 1px solid $primaryColor;
  }
}
.show-search-style {
  .search-icon {
    color: $primaryColor;
  }
  border-bottom: 1px solid $primaryColor;
}
.suggestion {
  position: absolute;
  z-index: 998;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 300px;
  top: 110%;
  left: -10px;
  opacity: 0;
  background-color: #fff;
  padding: 10px;
  .text {
    border-bottom: 1px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h4 {
      font-family: 'dingding', sans-serif;
      font-size: 16px;
    }
    .icon {
      cursor: pointer;
      transition: 0.3s all ease;
      &:hover {
        color: $dangerColor;
      }
    }
  }
  &-item {
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
    span {
      cursor: pointer;
      transition: 0.3s all ease;
      &:hover {
        color: $primaryColor;
      }
    }
  }
}
.showSuggestion {
  opacity: 1;
}
.own {
  height: 26px;
  line-height: 26px;
  font-size: 26px;
  margin-left: 20px;
  transition: 0.3s all linear;
  cursor: pointer;
  &:hover {
    color: $primaryColor;
  }
}
.cart {
  height: 26px;
  line-height: 26px;
  font-size: 26px;
  margin-left: 20px;
  position: relative;
  .icon {
    cursor: pointer;
    transition: 0.3s all linear;
  }
  &:hover {
    .icon {
      color: $primaryColor;
    }
  }

  &-num {
    cursor: pointer;
    font-size: 12px;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color: #fff;
    background-color: $primaryColor;
    top: -8px;
    left: 14px;
  }
}

.show-layer.layer {
  opacity: 1;
  transform: none;
}

.layer.stick {
  top: 85px;
}
</style>
