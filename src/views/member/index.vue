<script setup>
import UserInfo from '@/views/member/components/UserInfo.vue'
import SaveSet from '@/views/member/components/SaveSet.vue'
import AddressSet from '@/views/member/components/AddressSet.vue'
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const currentNavIndex = ref(+route.query.index || 0)
const changeNavIndex = (index) => {
  currentNavIndex.value = index
  router.replace('/member?index=' + index)
}
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
          <div class="member-nav-item" @click="changeNavIndex(4)" :class="{ active: currentNavIndex === 4 }">
            我的优惠券
          </div>
          <div class="member-nav-item" @click="changeNavIndex(5)" :class="{ active: currentNavIndex === 5 }">
            我的关注
          </div>
        </div>
        <div class="member-own" v-if="currentNavIndex === 0">
          <UserInfo></UserInfo>
        </div>
        <div class="save-set" v-if="currentNavIndex === 1">
          <SaveSet></SaveSet>
        </div>
        <div class="address-set" v-if="currentNavIndex === 2">
          <AddressSet></AddressSet>
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
