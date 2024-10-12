<script setup>
import { useCartStore } from '@/stores'
import { deleteCartItemBySkuIdApi } from '@/api/cart'
import { message } from '@/utils/resetMessage'
import { useRouter } from 'vue-router'
const router = useRouter()
const cartStore = useCartStore()
defineProps({
  cartNum: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['updateCartList', 'goToCart'])
const deleteCartItemBySkuId = async (skuId) => {
  const res = await deleteCartItemBySkuIdApi(skuId)
  message.success(res.msg)
  emit('updateCartList')
}
const goToCart = () => {
  router.push('/cart')
  emit('goToCart')
}
</script>
<template>
  <div class="layer" :class="[cartNum > 0 ? 'list-cart' : 'empty-cart']">
    <div :class="{ empty: cartNum === 0 }" v-if="cartNum === 0">
      <div class="content">
        <el-icon class="empty-icon">
          <ShoppingCart />
        </el-icon>
        <span>购物车空空如也，快去选购吧！</span>
      </div>
      <div class="btns">
        <button class="btn-item" @click="goToCart">去购物车</button>
      </div>
    </div>
    <div :class="{ list: cartNum > 0 }" v-if="cartNum > 0">
      <div>
        <el-scrollbar height="315px">
          <ul class="cart-items">
            <li class="cart-item" v-for="item in cartStore.cartList" :key="item.skuId">
              <div class="cart-img">
                <RouterLink :to="`/detail/product/${item.skuId}`"
                  ><el-image style="width: 82px; height: 82px" fit="contain" :src="item.image"></el-image
                ></RouterLink>
              </div>
              <div class="content">
                <div class="content-title">
                  <RouterLink :to="`/detail/product/${item.skuId}`">
                    {{ item.title }}
                  </RouterLink>
                </div>
                <div class="content-total" v-if="item.stock > 0">数量：{{ item.count }}</div>
                <div class="content-total" v-else>商品无货</div>
                <div class="content-price">&yen;{{ parseFloat(item.price).toFixed(2) }}</div>
              </div>
              <div class="delete" @click="deleteCartItemBySkuId(item.skuId)">
                <el-icon class="icon">
                  <CircleClose />
                </el-icon>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div class="btns">
        <button class="btn-item" @click="goToCart">去购物车</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-cart {
  transform: translateY(-230px) scale(1, 0);
}

.empty-cart {
  transform: translateY(-100px) scale(1, 0);
}

.layer {
  border-top: 1px solid #dcdcdc;
  box-shadow: 0 0 7px 0.5px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #ebebeb;
  z-index: 899;
  width: 380px;
  position: absolute;
  top: 140px;
  right: 15%;
  padding: 31px 30px 20px;
  opacity: 0;
  transition: all 0.3s 0.2s;

  .empty {
    font-family: 'dingding', sans-serif;
    display: flex;
    flex-direction: column;

    .content {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-icon {
      color: $primaryColor;
      font-size: 32px;
    }

    & span {
      margin-left: 10px;
      font-size: 18px;
    }
  }

  .list {
    width: 100%;

    .cart-item {
      display: flex;
      justify-content: space-evenly;
      font-size: 14px;
      height: 94px;

      border-bottom: 1px solid #ebebeb;
      padding-bottom: 10px;
      margin-top: 10px;

      .cart-img {
        width: 84px;
        height: 84px;
      }

      .content {
        width: 180px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;

        &-title {
          font-family: 'dingding', sans-serif;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;

          a {
            transition: 0.3s all linear;
            font-size: 14px;
          }
        }

        &-title:hover {
          a {
            color: $primaryColor;
          }
        }

        &-total {
          padding: 5px 0;
          color: #777;
          font-size: 14px;
        }

        &-price {
          color: $priceColor;
          font-size: 14px;
        }
      }

      .delete {
        margin-right: 5px;
        line-height: 35px;

        & .icon {
          font-size: 20px;
          color: #948e8e;
          cursor: pointer;
          transition: 0.3s all ease;
        }

        & .icon:hover {
          color: $dangerColor;
        }
      }
    }
  }
}

.btns {
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  .btn-item {
    font-family: 'dingding', sans-serif;
    letter-spacing: 2px;
    background-color: transparent;
    border: 2px solid #eeeeee;
    border-radius: 50px;
    color: #000101;
    display: block;
    font-size: 16px;
    line-height: 1;
    padding: 10px 20px 10px;
    text-align: center;
    transition: all 0.3s linear;
    cursor: pointer;
  }

  .btn-item:last-child {
    margin-top: 10px;
  }

  .btn-item:hover {
    background-color: $primaryColor;
    color: #fff;
  }
}
</style>
