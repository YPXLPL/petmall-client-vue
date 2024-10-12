<script setup>
import { useUserStore } from '@/stores/index.js'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
if (userStore.token) {
  userStore.getUserInfo()
}

const logout = () => {
  ElMessageBox.confirm('是否要退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      userStore.logout()
      ElNotification({
        title: '退出登录成功',
        type: 'success'
      })
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="top-nav">
    <div class="top-nav-content">
      <div class="top-nav-left">
        <div>
          <RouterLink to="/" class="active">Welcome To IPet</RouterLink>
        </div>
      </div>
      <div class="top-nav-right">
        <ul class="top-nav-right-ul">
          <li v-if="!userStore.user.username">
            <RouterLink to="/login" class="login active">
              <span>您好，</span>
              <span style="color: #fff">请先登录</span>
            </RouterLink>
          </li>
          <li v-else>
            <RouterLink to="/member" class="login active">
              <span>欢迎：</span>
              <span style="color: #fff">{{
                userStore.user.nickName ? userStore.user.nickName : userStore.user.username
              }}</span>
            </RouterLink>
          </li>
          <li v-if="userStore.user.username">
            <RouterLink to="" @click="logout" class="active">退出登录</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-nav {
  width: 100%;
  height: 30px;
  background-color: $primaryColor;
  color: rgb(205, 205, 205);

  &-content {
    margin: 0 auto;
    height: 30px;
    width: 1240px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-left {
    .active {
      color: #fff;
      transition: 0.3s all ease;
    }
    .active:hover {
      background-color: transparent !important;
      color: #ccc;
    }
  }
  &-right {
    height: 30px;
    display: flex;
    align-items: center;

    &-ul {
      display: flex;
    }

    &-ul li:not(:last-child)::after {
      content: '|';
      color: #ccc;
      margin: 0 10px;
    }

    .active {
      color: #ccc;
      transition: 0.3s all ease;
    }
    .active:hover {
      background-color: transparent !important;
      color: #fff;
    }
  }
}
</style>
