<script setup>
import { useCartStore } from '@/stores'
import { nextTick, ref, watch } from 'vue'
import { deleteCartItemBySkuIdApi, updateItemCountApi, updateItemCheckApi, updateAllItemCheckApi } from '@/api/cart'
import { ElMessageBox } from 'element-plus'
import { message } from '@/utils/resetMessage'
import { useRouter } from 'vue-router'
const router = useRouter()
const cartStore = useCartStore()
const changeCartItemCountHandler = async (item) => {
  if (item.count > item.stock || item.count < 0) {
    message.warning(`${item.title}购买数量有误`)
    return
  }
  await updateItemCountApi(item.skuId, item.count)
  await cartStore.getCartList()
  selectCartItem()
}
nextTick(async () => {
  selectCartItem()
})
const selectCheckBoxHandler = async (selection, row) => {
  if (row.stock <= 0) {
    await updateItemCheckApi(row.skuId, false)
  } else {
    await updateItemCheckApi(row.skuId, !row.check)
  }
  await cartStore.getCartList()
  selectCartItem()
}

const selectAllCheckBoxHandler = async (val) => {
  if (val.length) {
    await updateAllItemCheckApi(true)
  } else {
    await updateAllItemCheckApi(false)
  }
  await cartStore.getCartList()
  selectCartItem()
}

const deleteCartItem = async (skuId) => {
  await deleteCartItemBySkuIdApi(skuId)
  await cartStore.getCartList()
  selectCartItem()
}

const cartTableRef = ref()
const loading = ref(false)
const selectCartItem = () => {
  if (cartStore.cartList.length > 0) {
    cartStore.cartList.forEach((item) => {
      cartTableRef.value.toggleRowSelection(item, item.check)
    })
  }
}

watch(
  () => cartStore.cartList.length,
  () => {
    loading.value = true
    nextTick(() => {
      if (cartStore.cartList.length > 0) {
        cartStore.cartList.forEach((item) => {
          cartTableRef.value.toggleRowSelection(item, item.check)
        })
      }
      loading.value = false
    })
  }
)

const deleteCheckCartItemHandler = () => {
  const cartItems = cartTableRef.value.getSelectionRows()
  if (cartItems.length) {
    ElMessageBox.confirm('你确定要删除选中的商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      for (let i = 0; i < cartItems.length; i++) {
        await deleteCartItemBySkuIdApi(cartItems[i].skuId)
      }
      await cartStore.getCartList()
      selectCartItem()
    })
  } else {
    message.warning('你至少选中一件商品')
  }
}

const checkCart = () => {
  if (cartTableRef.value.getSelectionRows().length === 0) {
    message.warning('至少选中一个商品')
    return
  } else {
    router.push('/checkout')
  }
}
</script>
<template>
  <div class="cart" v-loading="loading">
    <div class="container">
      <div class="cart-title">
        <h3>你的购物车</h3>
      </div>
      <div v-if="cartStore.cartNum !== 0" class="cart-content">
        <el-table
          v-loading="loading"
          ref="cartTableRef"
          :data="cartStore.cartList"
          :height="cartStore.cartNum > 4 ? '732' : 'auto'"
          @select="selectCheckBoxHandler"
          @select-all="selectAllCheckBoxHandler"
          class="cart-table"
        >
          <el-table-column type="selection" width="50" :resizable="false"></el-table-column>
          <el-table-column
            prop="image"
            width="200"
            label="商品图片"
            header-align="center"
            align="center"
            :resizable="false"
          >
            <template #default="scope">
              <RouterLink :to="`/detail/product/${scope.row.skuId}`" class="img-active">
                <el-image :src="scope.row.image" fit="contain"></el-image>
              </RouterLink>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="商品名称"
            width="300"
            header-align="center"
            align="left"
            :resizable="false"
          >
            <template #default="scope">
              <div class="product-title">
                <RouterLink :to="`/detail/product/${scope.row.skuId}`" class="ellipsis-2">
                  {{ scope.row.title }}
                </RouterLink>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品属性" prop="skuAttrValues" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="price"
            label="单件价格"
            width="150"
            header-align="center"
            align="center"
            :resizable="false"
          >
            <template #default="scope"> &yen;{{ parseFloat(scope.row.price).toFixed(2) }} </template>
          </el-table-column>
          <el-table-column
            prop="count"
            label="数量"
            width="180"
            header-align="center"
            align="center"
            :resizable="false"
          >
            <template #default="scope">
              <el-input-number
                v-if="scope.row.stock > 0"
                ref="countRef"
                @change="changeCartItemCountHandler(scope.row)"
                v-model="scope.row.count"
                :min="1"
                :max="scope.row.stock"
              ></el-input-number>
              <span v-else>商品无货</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="总价"
            width="150"
            header-align="center"
            align="center"
            :resizable="false"
          >
            <template #default="scope">
              <span v-if="scope.row.stock > 0" class="item-total-price">
                &yen;{{ parseFloat(scope.row.totalPrice).toFixed(2) }}
              </span>
              <span v-else class="item-total-price">&yen;0.00</span>
            </template>
          </el-table-column>
          <el-table-column label="删除" width="80" header-align="center" align="center" :resizable="false">
            <template #default="scope">
              <div class="cart-delete" @click="deleteCartItem(scope.row.skuId)">
                <el-icon class="cart-delete-icon">
                  <Delete />
                </el-icon>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="cart-total">
          <div class="left">
            <button class="cart-clear-btn" @click="deleteCheckCartItemHandler">删除选中的商品</button>
          </div>
          <div class="right">
            <div class="cart-total-count">
              <h4>
                总件数：
                <span>{{ cartStore.totalCount }}</span>
              </h4>
            </div>
            <div class="cart-total-price">
              <h4>
                总价格：<span>&yen;{{ cartStore.totalPrice }}</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div v-if="cartStore.cartList.length !== 0" class="cart-footer">
        <button class="cart-footer-btn" @click.prevent="$router.go(-1)">继续购物</button>
        <button class="cart-footer-btn" @click.prevent="checkCart">去结算</button>
      </div>
      <div class="cart-empty" v-else>
        <div class="cart-empty-content">
          <el-icon class="empty-icon">
            <ShoppingCart />
          </el-icon>
          <span>购物车空空如也，快去选购吧！</span>
        </div>
        <div class="cart-empty-btn-box">
          <button class="cart-empty-btn" @click.prevent="$router.push('/home')">去购物</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart {
  padding: 100px 0;
  background-color: #fff;

  &-empty {
    display: flex;
    flex-direction: column;

    &-btn-box {
      margin: 20px auto;
      width: 450px;
    }

    &-btn {
      cursor: pointer;
      font-family: 'dingding', sans-serif;
      font-size: 18px;
      border-radius: 10px;
      letter-spacing: 3px;
      border: 0;
      width: 200px;
      height: 40px;
      transition: 0.3s all ease;
      background-color: $primaryColor;
      color: #fff;

      &:hover {
        background-color: #333;
      }
    }

    &-content {
      margin: 0 auto;
      width: 450px;
      display: flex;
      align-items: center;

      .empty-icon {
        color: $primaryColor;
        font-size: 40px;
      }

      span {
        font-family: 'dingding', sans-serif;
        margin-left: 15px;
        font-size: 25px;
      }
    }
  }

  &-title {
    h3 {
      font-family: 'dingding', sans-serif;
      font-size: 25px;
      padding-bottom: 27px;
      text-align: center;
    }
  }

  &-content {
    .product-title {
      a {
        transition: 0.3s all ease;

        &:hover {
          color: $primaryColor;
        }
      }
    }

    .item-total-price {
      color: $priceColor;
    }
  }

  &-delete {
    .cart-delete-icon {
      cursor: pointer;
      font-size: 20px;
      transition: 0.3s all ease;
    }

    .cart-delete-icon:hover {
      color: $primaryColor;
    }
  }

  .img-active {
    .el-image {
      width: 150px;
      height: 150px;
    }
  }

  &-total {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      .cart-clear-btn {
        cursor: pointer;
        font-family: 'dingding', sans-serif;
        font-size: 16px;
        background-color: $dangerColor;
        color: #fff;
        border-radius: 5px;
        border: 0;
        width: 150px;
        height: 30px;
        transition: 0.3s all ease;

        &:hover {
          background-color: #ad1a07;
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
    }

    h4 {
      font-family: 'dingding', sans-serif;
      color: $goodsDescColor;
      font-size: 20px;
    }

    &-count {
      margin-right: 30px;

      span {
        color: #333;
      }
    }

    &-price {
      span {
        color: $priceColor;
      }
    }
  }

  &-footer {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;

    &-btn {
      cursor: pointer;
      font-family: 'dingding', sans-serif;
      font-size: 18px;
      border-radius: 10px;
      letter-spacing: 3px;
      border: 0;
      width: 200px;
      height: 50px;
      transition: 0.3s all ease;
    }

    &-btn:first-child {
      border: 1px solid #b3aeae;
      color: #333;
      background-color: #fff;

      &:hover {
        color: #fff;
        background-color: $primaryColor;
      }
    }

    &-btn:last-child {
      color: #fff;
      background-color: $primaryColor;

      &:hover {
        background-color: #333;
      }
    }
  }
}

.cart-table ::v-deep .el-table__cell .cell {
  color: #333;
  font-size: 15px;
}
</style>
