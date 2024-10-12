import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoApi } from '@/api/auth.js'
export const useUserStore = defineStore(
  'petmall-user',
  () => {
    const token = ref(localStorage.getItem('token') || '')
    const refreshToken = ref(localStorage.getItem('refreshToken') || '')

    const setToken = (newToken) => {
      token.value = newToken
    }

    const logout = async () => {
      token.value = ''
      refreshToken.value = ''
      user.value = {}
      localStorage.removeItem('petmall-user')
    }

    const setRefreshToken = (newToken) => {
      refreshToken.value = newToken
    }

    const user = ref({})

    const getUserInfo = async () => {
      const res = await getUserInfoApi()
      user.value = res.data
    }

    const setUser = (obj) => {
      user.value = obj
    }
    const getUser = () => {
      return user.value
    }
    return {
      token,
      refreshToken,
      user,
      getUserInfo,
      getUser,
      setToken,
      setRefreshToken,
      setUser,
      logout
    }
  },
  {
    persist: true
  }
)
