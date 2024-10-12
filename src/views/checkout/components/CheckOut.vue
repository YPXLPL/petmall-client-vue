<script setup>
import { ref } from 'vue'
import { confirmOrderApi, submitOrderApi } from '@/api/order'
import SelectAddress from '@/views/checkout/components/SelectAddress.vue'
import { message } from '@/utils/resetMessage'
import { useRouter } from 'vue-router'
document.body.scrollTop = 0
const loading = ref(false)
const router = useRouter()
const curAddress = ref({})
const order = ref({})
const orderItems = ref([])
const confirmOrder = async () => {
  loading.value = true
  const res = await confirmOrderApi()
  order.value = res.data
  orderItems.value = order.value.orderItems
  curAddress.value = order.value.curAddress
  loading.value = false
  console.log(order.value)
}
confirmOrder()
const selectAddressRef = ref()
const showDialogHandler = () => {
  selectAddressRef.value.init()
}
const refreshHandler = () => {
  message.success('地址更改成功')
  confirmOrder()
}
const submitOrderData = ref({
  addressId: '',
  payType: '',
  orderToken: '',
  note: '',
  payPrice: ''
})
const createOrder = async () => {
  submitOrderData.value.orderToken = order.value.orderToken
  submitOrderData.value.payPrice = order.value.payPrice
  submitOrderData.value.addressId = curAddress.value.id
  submitOrderData.value.payType = 1
  const res = await submitOrderApi(submitOrderData.value)
  message.success(res.msg)
  console.log(res.data)
  router.push('/pay')
}
</script>
<template>
  <div class="checkout">
    <div class="container">
      <div class="wrapper" v-loading="loading">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="curAddress === undefined">请添加收货地址</div>
              <ul v-else class="address-contents">
                <li class="address-content">
                  <div class="address-text">收货人：</div>
                  <span>{{ curAddress.name }}</span>
                </li>
                <li class="address-content">
                  <div class="address-text">联系方式：</div>
                  <span>{{ curAddress.phone }}</span>
                </li>
                <li class="address-content">
                  <div class="address-text">收货地址：</div>
                  <div class="ellipsis">
                    <span>
                      {{ curAddress.province }} {{ curAddress.city }} {{ curAddress.region }}
                      {{ curAddress.detailAddress }}
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
        <SelectAddress ref="selectAddressRef" @refresh="refreshHandler"></SelectAddress>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <el-table :data="orderItems" :height="orderItems.length > 3 ? '500' : 'auto'">
            <el-table-column prop="image" label="商品图片" header-align="center" align="center" :resizable="false">
              <template #default="scope">
                <el-image :src="scope.row.image" fit="contain"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="商品名称" header-align="center" align="left" :resizable="false">
              <template #default="scope">
                <div class="product-title">
                  <div class="ellipsis-2">
                    {{ scope.row.title }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              label="商品属性"
              prop="skuAttrValues"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column prop="price" label="单件价格" header-align="center" align="center" :resizable="false">
              <template #default="scope"> &yen;{{ parseFloat(scope.row.price).toFixed(2) }} </template>
            </el-table-column>
            <el-table-column prop="count" label="数量" header-align="center" align="center" :resizable="false">
              <template #default="scope">
                {{ scope.row.hasStock ? `${scope.row.count}件` : '商品无货' }}
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="总价" header-align="center" align="center" :resizable="false">
              <template #default="scope">
                <span class="item-total-price"> &yen;{{ parseFloat(scope.row.totalPrice).toFixed(2) }} </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 优惠券 -->
        <h3 class="box-title">优惠券</h3>
        <div class="box-body"></div>
        <!-- 备注信息 -->
        <h3 class="box-title">订单备注</h3>
        <div class="box-body">
          <el-input
            placeholder="请输入备注内容"
            type="textarea"
            v-model="submitOrderData.note"
            show-word-limit
            maxlength="60"
          ></el-input>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ order.totalCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ parseFloat(order.totalPrice).toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ '0.00' }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">¥{{ parseFloat(order.totalPrice).toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button @click="$router.go(-1)" size="large" style="margin-right: 15px">返回</el-button>
          <el-button @click="createOrder" type="primary" size="large">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checkout {
  background-color: #fff;
  padding: 50px 0;
  .wrapper {
    border: 1px solid #ccc;
    border-radius: 20px;
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-family: 'dingding', sans-serif;
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

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

.el-table {
  .el-image {
    width: 130px;
    height: 130px;
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $primaryColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $primaryColor;
      background: lighten($primaryColor, 50%);
    }

    > ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>
