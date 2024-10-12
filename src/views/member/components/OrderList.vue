<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCountDown } from '@/utils/useCountDown'
import { getOrderListApi, changeOrderStatusFinishApi, deleteOrderApi, getOrderApi } from '@/api/order'
import { useUserStore } from '@/stores'
import OrderDetialDialog from '@/views/member/components/OrderDetailDialog.vue'
import { ElMessageBox } from 'element-plus'
import { message } from '@/utils/resetMessage'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const currentNavIndex = ref(+route.query.navIndex || -1)
const changeNavIndex = (index) => {
  currentNavIndex.value = index
  router.replace('/member?index=3&navIndex=' + index)
}
const loading = ref(false)
const orderList = ref([])
const timerOut = ref([])
const getOrderList = async () => {
  loading.value = true
  const res = await getOrderListApi(userStore.user.id, currentNavIndex.value)
  orderList.value = res.data
  for (let index = 0; index < orderList.value.length; index++) {
    if (orderList.value[index].status === 0) {
      const orderRes = await getOrderApi(orderList.value[index].orderSn)
      if (orderRes.data.timeRemaining != -1) {
        timerOut.value[index] = useCountDown()
        timerOut.value[index].start(orderRes.data.timeRemaining)
      }
    }
  }
  loading.value = false
}
getOrderList()
watch(
  () => route.query.navIndex,
  () => {
    currentNavIndex.value = +route.query.navIndex
    getOrderList()
  }
)
watch(
  () => timerOut.value,
  (value) => {
    for (let index = 0; index < value.length; index++) {
      if (value[index].time === 0) {
        getOrderList()
        value[index].clearIntervalHandler()
        value.splice(index, 1)
      }
    }
  },
  {
    deep: true
  }
)
const orderDetialDialogRef = ref()
const showOrderDetailHandler = (orderSn) => {
  orderDetialDialogRef.value.init(orderSn)
}
const changeStatusToReceiveHandler = (orderSn) => {
  ElMessageBox.confirm('你要确认收货吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(async () => {
      const res = await changeOrderStatusFinishApi(orderSn)
      message.success(res.msg)
      router.replace('/member?index=3&navIndex=3&flag=true')
    })
    .catch(() => {})
}

const deleteOrder = (orderSn) => {
  ElMessageBox.confirm('你要删除该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteOrderApi(userStore.user.id, orderSn)
      message.success(res.msg)
      getOrderList()
    })
    .catch(() => {})
}

const goToPayHandler = (orderSn) => {
  router.replace(`/pay?orderSn=${orderSn}`)
}
</script>
<template>
  <div class="order">
    <ul class="order-nav">
      <li class="order-nav-item" @click="changeNavIndex(-1)" :class="{ active: currentNavIndex === -1 }">
        <span>全部订单</span>
      </li>
      <li class="order-nav-item" @click="changeNavIndex(0)" :class="{ active: currentNavIndex === 0 }">
        <span>待付款</span>
      </li>
      <li class="order-nav-item" @click="changeNavIndex(1)" :class="{ active: currentNavIndex === 1 }">
        <span>待发货</span>
      </li>
      <li class="order-nav-item" @click="changeNavIndex(2)" :class="{ active: currentNavIndex === 2 }">
        <span>已发货</span>
      </li>
      <li class="order-nav-item" @click="changeNavIndex(3)" :class="{ active: currentNavIndex === 3 }">
        <span>已完成</span>
      </li>
      <li class="order-nav-item" @click="changeNavIndex(4)" :class="{ active: currentNavIndex === 4 }">
        <span>已关闭</span>
      </li>
      <!-- <li class="order-nav-item" @click="changeNavIndex(5)" :class="{ active: currentNavIndex === 5 }">
        <span>售后</span>
      </li> -->
    </ul>
    <div class="order-list" style="margin-top: 30px">
      <el-table
        v-loading="loading"
        border="1"
        class="order-table"
        :data="orderList"
        :height="orderList.length > 4 ? '650' : 'auto'"
      >
        <template #empty>
          <el-empty description="暂无相关订单"></el-empty>
        </template>
        <el-table-column type="index" width="80" label="序号" header-align="center" align="center"></el-table-column>
        <el-table-column
          label="订单号"
          width="200"
          prop="orderSn"
          header-align="center"
          align="center"
          :resizable="false"
        >
          <template #default="scope">
            <div class="product-orderSn">
              <div class="ellipsis">
                {{ scope.row.orderSn }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderImg" label="图片" header-align="center" align="center" :resizable="false">
          <template #default="scope">
            <el-image :src="scope.row.orderImg" fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="skuName" label="名称" header-align="center" align="center" :resizable="false">
          <template #default="scope">
            <div class="product-skuName">
              <div class="ellipsis-2">
                {{ scope.row.skuName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" prop="status" header-align="center" align="center" :resizable="false">
          <template #default="scope">
            <el-tag type="warning" v-if="scope.row.status === 0">待付款</el-tag>
            <el-tag type="success" v-if="scope.row.status === 1">待发货</el-tag>
            <el-tag type="success" v-if="scope.row.status === 2">待收货</el-tag>
            <el-tag type="success" v-if="scope.row.status === 3">已完成</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 4">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="总额"
          width="150"
          prop="payAmount"
          header-align="center"
          align="center"
          :resizable="false"
        >
          <template #default="scope"> &yen;{{ parseFloat(scope.row.payAmount).toFixed(2) }} </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createTime" header-align="center" align="center" :resizable="false">
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="支付剩余时间"
          width="120"
          prop="createTime"
          header-align="center"
          align="center"
          :resizable="false"
        >
          <template #default="scope">
            <span style="color: #ff0000" v-if="scope.row.status === 0">{{ timerOut[scope.$index].formatTime }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center" :resizable="false" width="120">
          <template #default="scope">
            <div class="control-btn">
              <el-button
                type="success"
                v-if="scope.row.status === 2"
                @click="changeStatusToReceiveHandler(scope.row.orderSn)"
              >
                确认收货</el-button
              >
              <el-button type="warning" v-if="scope.row.status === 0" @click="goToPayHandler(scope.row.orderSn)"
                >去付款</el-button
              >
              <el-button v-else type="primary" @click="showOrderDetailHandler(scope.row.orderSn)">查看详情</el-button>
              <el-button
                type="danger"
                @click="deleteOrder(scope.row.orderSn)"
                v-if="scope.row.status === 4 || scope.row.status === 3"
              >
                删除订单</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <OrderDetialDialog ref="orderDetialDialogRef"></OrderDetialDialog>
  </div>
</template>

<style lang="scss" scoped>
.order {
  width: 1300px;
  margin: 0 auto;
  margin-top: 20px;

  &-nav {
    font-family: 'dingding', sans-serif;
    display: flex;
    justify-content: center;

    &-item {
      font-size: 16px;
      transition: 0.3s all ease;

      span {
        cursor: pointer;
        border-bottom: 2px solid transparent;
      }
    }

    &-item:nth-child(2n) {
      margin: 0 20px;
    }

    .active {
      color: $primaryColor;

      span {
        border-bottom: 2px solid $primaryColor;
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

.control-btn {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  & button {
    display: block;
    margin: 2px auto;
    width: 100px;
  }
}
</style>
