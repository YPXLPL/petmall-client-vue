<script setup>
import { ref } from 'vue'
import { getOrderDetailApi } from '@/api/order'
import { cartBackCartItemsApi } from '@/api/cart'
import { message } from '@/utils/resetMessage'
import { useUserStore, useCartStore } from '@/stores'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const visible = ref(false)
const orderDetail = ref({
  order: {},
  orderItems: [],
  payPrice: 0.0,
  buyTotalCount: 0
})
const init = (orderSn) => {
  visible.value = true
  getOrderDetail(orderSn)
}
const orderItems = ref([])
const getOrderDetail = async (orderSn) => {
  const res = await getOrderDetailApi(orderSn)
  orderDetail.value = res.data
  orderItems.value = orderDetail.value.orderItems
}
const cartBackData = ref({})
const reBuyProductHandler = async () => {
  const cartItems = orderItems.value.map((item) => {
    return { skuId: item.skuId, count: item.skuBuyNum }
  })
  cartBackData.value.cartItems = cartItems
  cartBackData.value.memberId = userStore.user.id
  const res = await cartBackCartItemsApi(cartBackData.value)
  cartStore.getCartList()
  message.success(res.msg)
  router.push('/cart')
}
defineExpose({
  init
})
</script>

<template>
  <el-dialog
    width="1240"
    title="订单详情"
    align-center
    v-model="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <el-scrollbar :height="orderItems.length >= 2 ? '700' : 'auto'">
      <div class="order-info-box">
        <div class="info-title">订单号：</div>
        <div class="info-content">{{ orderDetail.order?.orderSn }}</div>
      </div>
      <div class="order-info-box">
        <div class="info-title">订单详情：</div>
      </div>
      <el-table
        v-loading="loading"
        border="1"
        class="order-table"
        :data="orderDetail.orderItems"
        :height="orderDetail.orderItems.length > 2 ? '340' : 'auto'"
      >
        <el-table-column
          type="index"
          width="80"
          label="序号"
          header-align="center"
          align="center"
          :resizable="false"
        ></el-table-column>
        <el-table-column label="商品名称" prop="skuName" header-align="center" align="center" :resizable="false">
          <template #default="scope">
            <div class="product-title">
              <div class="ellipsis-2">
                {{ scope.row.skuName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="image"
          :resizable="false"
          width="200"
          label="商品图片"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <el-image :src="scope.row.image" fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="商品属性"
          prop="skuAttrsVals"
          header-align="center"
          align="center"
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="skuPrice"
          width="150"
          label="单件价格"
          header-align="center"
          align="center"
          :resizable="false"
        >
          <template #default="scope"> &yen;{{ parseFloat(scope.row.skuPrice).toFixed(2) }} </template>
        </el-table-column>
        <el-table-column
          prop="skuBuyNum"
          width="150"
          label="数量"
          header-align="center"
          align="center"
          :resizable="false"
        >
          <template #default="scope"> {{ scope.row.skuBuyNum }}件 </template>
        </el-table-column>
        <el-table-column
          prop="realPrice"
          width="150"
          label="总价"
          header-align="center"
          align="center"
          :resizable="false"
        >
          <template #default="scope">
            <span class="item-total-price"> &yen;{{ parseFloat(scope.row.realPrice).toFixed(2) }} </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="order-info-box">
        <div class="info-title">总数：</div>
        <div class="info-content">{{ orderDetail.buyTotalCount }}件</div>
      </div>
      <div class="order-info-box">
        <div class="info-title">订单总价：</div>
        <div class="info-content item-total-price">&yen;{{ parseFloat(orderDetail.payPrice).toFixed(2) }}</div>
      </div>
      <div class="order-info-box">
        <div class="info-title">支付方式：</div>
        <div class="info-content">{{ orderDetail.order?.payType === 1 ? '在线支付' : '货到付款' }}</div>
      </div>
      <div class="order-info-box">
        <div class="info-title">收货人：</div>
        <div class="info-content">{{ orderDetail.order?.receiverName }}</div>
      </div>
      <div class="order-info-box">
        <div class="info-title">联系电话：</div>
        <div class="info-content">{{ orderDetail.order?.receiverPhone }}</div>
      </div>
      <div class="order-info-box">
        <div class="info-title">详细地址：</div>
        <div class="info-content">{{ orderDetail.order?.receiverDetailAddress }}</div>
      </div>
      <div class="order-info-box">
        <div class="info-title">订单备注：</div>
        <div class="info-content">
          {{ orderDetail.order?.note === '' ? '无' : orderDetail.order?.note }}
        </div>
      </div>
      <div class="order-info-box">
        <div class="info-title">状态：</div>
        <div class="info-content">
          <el-tag type="warning" v-if="orderDetail.order?.status === 0">待付款</el-tag>
          <el-tag type="success" v-if="orderDetail.order?.status === 1">待发货</el-tag>
          <el-tag type="success" v-if="orderDetail.order?.status === 2">待收货</el-tag>
          <el-tag type="success" v-if="orderDetail.order?.status === 3">已完成</el-tag>
          <el-tag type="danger" v-if="orderDetail.order?.status === 4">已关闭</el-tag>
        </div>
      </div>
    </el-scrollbar>
    <template #footer>
      <el-button type="primary" @click="reBuyProductHandler">再次购买</el-button>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.order-info-box {
  display: flex;
  margin: 10px 0;
  width: 700px;
  height: 32px;
  align-items: center;
  .info-title {
    font-family: 'dingding', sans-serif;
    width: 100px;
    font-size: 16px;
  }
  .info-content {
    width: 100%;
    font-size: 14px;
    padding: 0 11px;
  }
  .info-content.edit {
    padding: 0;
  }
}
.el-table {
  .el-image {
    width: 130px;
    height: 130px;
  }
}
.item-total-price {
  color: $priceColor;
}
</style>
