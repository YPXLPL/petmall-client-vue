import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      meta: {
        name: '首页',
        title: 'I宠购物商城'
      },
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            name: '首页',
            title: 'I宠购物商城'
          },
          component: () => import('@/views/home/index.vue')
        },
        {
          path: '/detail/:type/:id',
          name: 'detail',
          meta: {
            name: '商品详情',
            title: '商品详情'
          },
          component: () => import('@/views/detail/index.vue')
        },
        {
          path: '/cart',
          name: 'cart',
          meta: {
            name: '购物车',
            title: '购物车'
          },
          component: () => import('@/views/cart/index.vue')
        },
        {
          path: '/checkout',
          name: 'checkout',
          meta: {
            name: '订单确认',
            title: '订单确认'
          },
          component: () => import('@/views/checkout/index.vue')
        },
        {
          path: '/member',
          name: 'member',
          meta: {
            name: '个人中心',
            title: '个人中心'
          },
          component: () => import('@/views/member/index.vue')
        },
        {
          path: '/search',
          name: 'search',
          meta: {
            name: '搜索',
            title: '搜索结果'
          },
          component: () => import('@/views/search/index.vue')
        },
        {
          path: '/pay',
          name: 'pay',
          meta: {
            name: '付款',
            title: '付款'
          },
          component: () => import('@/views/pay/index.vue')
        },
        {
          path: '/payBack',
          name: 'payBack',
          meta: {
            name: '已付款',
            title: '支付完成'
          },
          component: () => import('@/views/pay/PayBack.vue')
        },
        {
          path: '/brand',
          name: 'brand',
          meta: {
            name: '品牌管',
            title: '品牌管'
          },
          component: () => import('@/views/brand/index.vue')
        },
        {
          path: '/brand-goods/:brandId',
          name: 'brand-goods',
          meta: {
            name: '品牌专场',
            title: '品牌专场'
          },
          component: () => import('@/views/brand-goods/index.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
      hidden: true
    },
    {
      path: '/404',
      name: '404',
      meta: {
        name: '404页面丢失了',
        title: '404页面丢失了'
      },
      component: () => import('@/views/404/404Error.vue')
    }
  ]
})
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (userStore.token && to.path === '/login') {
    return '/'
  }
  window.document.title = to.meta.title
})
router.afterEach(() => {
  window.scrollTo(0, 0) // 切换路由之后滚动条始终在最顶部
})
export default router
