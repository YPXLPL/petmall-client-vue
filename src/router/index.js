import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      meta: {
        name: '首页'
      },
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            name: '首页'
          },
          component: () => import('@/views/home/index.vue')
        },
        {
          path: '/detail/:type/:id',
          name: 'detail',
          meta: {
            name: '商品详情'
          },
          component: () => import('@/views/detail/index.vue')
        },
        {
          path: '/cart',
          name: 'cart',
          meta: {
            name: '购物车'
          },
          component: () => import('@/views/cart/index.vue')
        },
        {
          path: '/checkout',
          name: 'checkout',
          meta: {
            name: '订单确认'
          },
          component: () => import('@/views/checkout/index.vue')
        },
        {
          path: '/member',
          name: 'member',
          meta: {
            name: '个人中心'
          },
          component: () => import('@/views/member/index.vue')
        },
        {
          path: '/search',
          name: 'search',
          meta: {
            name: '搜索'
          },
          component: () => import('@/views/search/index.vue')
        },
        {
          path: '/pay',
          name: 'pay',
          meta: {
            name: '付款'
          },
          component: () => import('@/views/pay/index.vue')
        }
      ]
    }
  ]
})
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (userStore.token && to.path === '/login') {
    return '/'
  }
})
export default router
