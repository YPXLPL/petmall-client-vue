<script setup>
import LayoutTopNav from '@/views/layout/components/LayoutTopNav.vue'
import LayoutHeader from '@/views/layout/components/LayoutHeader.vue'
import LayoutFooter from '@/views/layout/components/LayoutFooter.vue'
import LayoutScrollUp from '@/views/layout/components/LayoutScrollUp.vue'
import { message } from '@/utils/resetMessage.js'
import { useUserStore } from '@/stores'
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const socket = ref(null)
const init = () => {
  socket.value = new WebSocket(`ws://192.168.80.1:13320/auth/websocket/${userStore.user.id}`)
  socket.value.onerror = () => {}
  //连接成功建立的回调方法
  socket.value.onopen = () => {}
  //接收到消息的回调方法
  socket.value.onmessage = (event) => {
    if (event.data) {
      const res = JSON.parse(event.data)
      if (!res.status) {
        socket.value.close()
        message.error(res.msg)
        userStore.logout()
        router.push('/login')
      }
    }
  }
}
setTimeout(() => {
  if (userStore.user.id) {
    init()
  }
}, 1000)
onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.close()
  }
})
</script>
<template>
  <LayoutTopNav></LayoutTopNav>
  <LayoutScrollUp></LayoutScrollUp>
  <LayoutHeader></LayoutHeader>
  <RouterView></RouterView>
  <LayoutFooter></LayoutFooter>
</template>

<style lang="scss" scoped></style>
