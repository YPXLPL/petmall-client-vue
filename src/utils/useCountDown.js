// 封装倒计时逻辑函数
import { computed, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
export const useCountDown = () => {
  // 1. 响应式的数据
  let timer = null
  const time = ref(0)
  // 格式化时间 为 xx分xx秒
  const formatTime = computed(() => dayjs.unix(time.value).format('mm分ss秒'))
  // 2. 开启倒计时的函数
  const start = (currentTime) => {
    // 开始倒计时的逻辑
    // 核心逻辑的编写：每隔1s就减一
    time.value = currentTime
    if (time.value > 0) {
      timer = setInterval(() => {
        time.value--
        if (time.value === 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  }
  // 组件销毁时清除定时器
  onUnmounted(() => {
    timer && clearInterval(timer)
  })
  const clearIntervalHandler = () => {
    clearInterval(timer)
  }
  return {
    formatTime,
    time,
    start,
    clearIntervalHandler
  }
}
