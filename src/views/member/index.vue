<script setup>
import UserInfo from '@/views/member/components/UserInfo.vue'
import SafeSet from '@/views/member/components/SafeSet.vue'
import AddressSet from '@/views/member/components/AddressSet.vue'
import OrderList from '@/views/member/components/OrderList.vue'
import { ref, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from '@/utils/resetMessage'
const router = useRouter()
const route = useRoute()
const currentNavIndex = ref(+route.query.index || 0)
const orderNavIndex = ref(+route.query.navIndex)
const changeNavIndex = (index) => {
  currentNavIndex.value = index
  if (currentNavIndex.value === 3) {
    orderNavIndex.value = -1
    router.replace(`/member?index=${currentNavIndex.value}&navIndex=${orderNavIndex.value}`)
  } else {
    router.replace(`/member?index=${currentNavIndex.value}`)
  }
}
// const changeNavNoIndex = () => {
//   message.warning('功能待开发')
// }
watch(
  () => route.query.navIndex,
  () => {
    currentNavIndex.value = +route.query.index
    orderNavIndex.value = +route.query.navIndex || ''
    router.replace(`/member?index=${currentNavIndex.value}&navIndex=${orderNavIndex.value}`)
  }
)
</script>

<template>
  <div class="member">
    <PageHeader title="个人中心"></PageHeader>
    <div class="container">
      <div class="member-nav">
        <div class="member-nav-items">
          <div class="member-nav-item" @click="changeNavIndex(0)" :class="{ active: currentNavIndex === 0 }">
            个人信息
          </div>
          <div class="member-nav-item" @click="changeNavIndex(1)" :class="{ active: currentNavIndex === 1 }">
            安全设置
          </div>
          <div class="member-nav-item" @click="changeNavIndex(2)" :class="{ active: currentNavIndex === 2 }">
            地址管理
          </div>
          <div class="member-nav-item" @click="changeNavIndex(3)" :class="{ active: currentNavIndex === 3 }">
            我的订单
          </div>
          <!-- <div class="member-nav-item" @click="changeNavNoIndex()">我的优惠券</div>
          <div class="member-nav-item" @click="changeNavNoIndex()">我的关注</div> -->
        </div>
        <div class="member-own" v-if="currentNavIndex === 0">
          <UserInfo></UserInfo>
        </div>
        <div class="save-set" v-if="currentNavIndex === 1">
          <SafeSet></SafeSet>
        </div>
        <div class="address-set" v-if="currentNavIndex === 2">
          <AddressSet></AddressSet>
        </div>
        <div class="order-list" v-if="currentNavIndex === 3">
          <OrderList></OrderList>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.member {
  padding-bottom: 100px;
  background-color: #fff;
  &-nav {
    margin-top: 25px;
    &-items {
      display: flex;
      justify-content: center;
    }
    &-item {
      font-family: 'dingding', sans-serif;
      font-size: 18px;
      cursor: pointer;
      position: relative;
      transition: 0.3s all ease;
      &:hover {
        color: $primaryColor;
      }
    }
    &-item:not(:last-child) {
      margin-right: 30px;
    }
    &-item:not(:last-child)::before {
      content: '|';
      bottom: 1px;
      color: #ccc;
      position: absolute;
      font-family: sans-serif;
      right: -15px;
    }
    .active {
      color: $primaryColor;
    }
  }
}
</style>
