<script setup>
import PageHeader from '@/components/PageHeader.vue'
import { useCountDown } from '@/utils/useCountDown'
import { useRoute, useRouter } from 'vue-router'
import { getOrderApi, updateOrderAddressApi, orderCloseBackCartApi, closeOrderApi } from '@/api/order'
import { useUserStore, useCartStore } from '@/stores'
import { ref, watch } from 'vue'
import SelectAddress from '@/views/checkout/components/SelectAddress.vue'
import { message } from '@/utils/resetMessage'
import { ElMessageBox } from 'element-plus'
document.body.scrollTop = 0
const userStore = useUserStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()
const orderSn = route.query.orderSn
if (orderSn === undefined) {
  router.replace('/home')
}
const loading = ref(false)
const order = ref({})
const { formatTime, time, start, clearIntervalHandler } = useCountDown()
const curAddress = ref({
  receiverName: '',
  receiverPhone: '',
  receiverDetailAddress: ''
})
const content = ref('')
const status = ref('')
const getOrder = async () => {
  loading.value = true
  const res = await getOrderApi(orderSn)
  if (res.data === undefined) {
    router.replace('/home')
  }
  order.value = res.data
  curAddress.value.receiverName = order.value.receiverName
  curAddress.value.receiverPhone = order.value.receiverPhone
  curAddress.value.receiverDetailAddress = order.value.receiverDetailAddress
  status.value = order.value.status
  clearIntervalHandler()
  loading.value = false
  if (status.value === 1) {
    visible.value = true
    content.value = '订单交易已完成'
    clearIntervalHandler()
  } else if (status.value === 4) {
    visible.value = true
    content.value = '订单交易已关闭'
    clearIntervalHandler()
  }
  if (order.value.timeRemaining != -1) {
    start(order.value.timeRemaining)
  }
}
getOrder()
const visible = ref(false)
const selectAddressRef = ref()
const showDialogHandler = () => {
  selectAddressRef.value.init()
}
const updateAddressData = ref({
  memberId: '',
  orderSn: ''
})
const refreshHandler = async () => {
  updateAddressData.value.memberId = userStore.user.id
  updateAddressData.value.orderSn = order.value.orderSn
  const res = await updateOrderAddressApi(updateAddressData.value)
  message.success(res.msg)
  getOrder()
}
watch(
  () => time.value,
  (value) => {
    if (value === 0) {
      visible.value = true
      content.value = '下单超时，订单交易已关闭'
    }
  }
)
const backCartHandler = async () => {
  await orderCloseBackCartApi(userStore.user.id, order.value.orderSn)
  cartStore.getCartList()
  router.replace('/cart')
}
const cancelOrderHandler = () => {
  ElMessageBox.confirm('你确定要取消订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await closeOrderApi(order.value)
      message.success(res.msg)
      router.replace('/member?index=3')
    })
    .catch(() => {})
}

const baseURL = 'http://petmall-project.natapp1.cc'
const backURL = 'http://localhost:8991/payBack'
const redirectUrl = encodeURIComponent(backURL)
const payUrl = `${baseURL}/order/open/payOrder?orderSn=${route.query.orderSn}&redirect=${redirectUrl}`
</script>

<template>
  <PageHeader title="付款"></PageHeader>
  <div class="pay" v-loading="loading">
    <div class="container">
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>
            支付还剩 <span style="color: red">{{ formatTime }}</span
            >, 超时后将取消订单
          </p>
          <button class="btn" @click.prevent="cancelOrderHandler">取消订单</button>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ parseFloat(order.payAmount).toFixed(2) }}</span>
        </div>
      </div>
      <div class="address-box">
        <p class="head">收货地址</p>
        <div class="address-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="curAddress === undefined">请添加收货地址</div>
              <ul v-else class="address-contents">
                <li class="address-content">
                  <div class="address-text">收货人：</div>
                  <span>{{ curAddress.receiverName }}</span>
                </li>
                <li class="address-content">
                  <div class="address-text">联系方式：</div>
                  <span>{{ curAddress.receiverPhone }}</span>
                </li>
                <li class="address-content">
                  <div class="address-text">收货地址：</div>
                  <div class="ellipsis">
                    <span>
                      {{ curAddress.receiverDetailAddress }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="showDialogHandler">切换地址</el-button>
            </div>
          </div>
        </div>
      </div>
      <SelectAddress ref="selectAddressRef" @refresh="refreshHandler"></SelectAddress>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <a class="btn alipay" :href="payUrl"></a>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="visible"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :destroy-on-close="true"
    >
      <div class="pay-time-out">
        <div class="content">
          <h3>{{ content }}</h3>
        </div>
        <div class="btns">
          <button class="btn" v-if="status !== 1" @click.prevent="backCartHandler">返回购物车重新下单</button>
          <button class="btn" @click.prevent="$router.replace('/home')">返回商城</button>
          <button class="btn" @click.prevent="$router.replace('/member?index=3')">去我的订单</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.pay {
  background-color: #fff;
  padding: 50px 0;
}

.pay-info {
  border-radius: 10px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;

  .icon {
    font-size: 80px;
    color: #1dc779;
  }

  .tip {
    padding-left: 10px;
    flex: 1;

    p {
      font-family: 'dingding', sans-serif;

      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }

      &:nth-child(2) {
        color: #999;
        font-size: 16px;
      }
    }

    .btn {
      font-family: 'dingding', sans-serif;
      cursor: pointer;
      border-radius: 5px;
      letter-spacing: 2px;
      width: 100px;
      height: 30px;
      margin-top: 5px;
      font-size: 15px;
      background-color: $dangerColor;
      border: 0;
      color: #fff;
      transition: 0.3s all ease;

      &:hover {
        background-color: #8d0606;
      }
    }
  }

  .amount {
    font-family: 'dingding', sans-serif;

    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }

      &:last-child {
        color: $priceColor;
        font-size: 20px;
      }
    }
  }
}

.address-box {
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-top: 20px;
  padding-bottom: 70px;
  height: 200px;

  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;

    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
}

.address-body {
  padding: 20px 0;
}

.address {
  display: flex;
  align-items: center;
  padding: 0 30px;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    .address-contents {
      .address-content {
        width: 900px;
        display: flex;
      }

      .address-content:nth-child(2) {
        margin: 5px 0;
      }

      .address-text {
        font-family: 'dingding', sans-serif;
        text-align: right;
        width: 76px;
      }

      span {
        color: #333;
      }
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.pay-type {
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-top: 20px;
  padding-bottom: 70px;
  height: 200px;

  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;

    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }

  .item {
    margin-top: 30px;
  }

  .btn {
    cursor: pointer;
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    border-radius: 10px;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    transition: 0.3s all ease;

    &.active,
    &:hover {
      border-color: $primaryColor;
    }

    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat
        center / contain;
    }

    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat
        center / contain;
    }
  }
}

.pay-time-out {
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    color: #333;
    font-family: 'dingding', sans-serif;
    font-size: 30px;
  }

  .btns {
    margin-top: 50px;

    .btn {
      cursor: pointer;
      height: 50px;
      border-radius: 10px;
      font-size: 16px;
      font-family: 'dingding', sans-serif;
      letter-spacing: 2px;
      transition: 0.3s all ease;
    }

    .btn:first-child {
      width: 200px;
      background-color: $primaryColor;
      color: #fff;
      border: 0;

      &:hover {
        background-color: #333;
      }
    }

    .btn:not(:first-child) {
      width: 150px;

      margin-left: 30px;
      background-color: #fff;
      border: 1px solid #ccc;
      color: #333;

      &:hover {
        color: #fff;
        background-color: $primaryColor;
      }
    }
  }
}
</style>
