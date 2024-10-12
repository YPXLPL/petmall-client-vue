import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getOwnCartListApi, getTotalPriceApi } from '@/api/cart'
export const useCartStore = defineStore('cart-list', () => {
  const cartNum = ref(0)
  const totalCount = ref(0)
  const curCount = ref(0)
  const totalPrice = ref(0)
  const cartList = ref([])
  const getCartList = async () => {
    const res = await getOwnCartListApi()
    if (res.data) {
      cartList.value = res.data
      cartNum.value = res.data.length
      totalCount.value = cartList.value
        .filter((item) => item.check)
        .reduce((prev, item) => {
          return prev + item.count
        }, 0)
      curCount.value = cartList.value.reduce((prev, item) => {
        return prev + item.count
      }, 0)
    } else {
      cartList.value = []
      cartNum.value = 0
      totalCount.value = 0
    }
    getTotalPrice()
  }
  const getTotalPrice = async () => {
    const res = await getTotalPriceApi()
    totalPrice.value = parseFloat(res.data).toFixed(2)
  }
  return {
    cartNum,
    getCartList,
    curCount,
    cartList,
    totalCount,
    totalPrice,
    getTotalPrice
  }
})
