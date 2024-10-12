<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { getOrderApi } from '@/api/order'
const loading = ref(false)
const order = ref({})
const orderSn = route.query.orderSn
if (orderSn === undefined) {
  router.replace('/home')
}
const getOrder = async () => {
  loading.value = true
  const res = await getOrderApi(orderSn)
  if (res.data === undefined) {
    router.replace('/home')
  }
  order.value = res.data
}
getOrder()
</script>

<template>
  <div class="pay-back">
    <div class="container">
      <!-- 支付结果 -->
      <div class="pay-result">
        <!-- 路由参数获取到的是字符串而不是布尔值 -->
        <span class="iconfont icon-queren green" v-if="order.status === 1"></span>
        <span class="iconfont icon-shanchu red" v-else></span>
        <p class="tit">支付{{ order.status === 1 ? '成功' : '失败' }}</p>
        <p class="tip">我们将尽快为您发货，收货期间请保持手机畅通</p>
        <p>支付方式：<span>支付宝</span></p>
        <p>
          支付金额：<span>¥{{ parseFloat(order.payAmount).toFixed(2) }}</span>
        </p>
        <div class="btn">
          <el-button type="primary" style="margin-right: 20px" @click="$router.push('/member?index=3')"
            >查看订单</el-button
          >
          <el-button @click="$router.push('/home')">进入首页</el-button>
        </div>
        <p class="alert">
          <span class="iconfont icon-tip"></span>
          温馨提示：I宠不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，保护资产、谨慎操作。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pay-back {
  padding: 50px 0;
}
.pay-result {
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  text-align: center;

  > .iconfont {
    font-size: 100px;
  }

  .green {
    color: #1dc779;
  }

  .red {
    color: $priceColor;
  }

  .tit {
    font-size: 24px;
  }

  .tip {
    color: #999;
  }

  p {
    line-height: 40px;
    font-size: 16px;
  }

  .btn {
    margin-top: 50px;
  }

  .alert {
    font-size: 12px;
    color: #999;
    margin-top: 50px;
  }
}
</style>
