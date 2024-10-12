<script setup>
import { getHomeGoodsListApi } from '@/api/goods'
import { ref } from 'vue'
const props = defineProps({
  title: {
    require: true,
    type: String
  },
  catSubType: {
    require: true,
    type: Number
  }
})
const goodsItemList = ref([])
const getHomeGoodsList = async () => {
  const res = await getHomeGoodsListApi(props.catSubType)
  goodsItemList.value = res.data
}
getHomeGoodsList()
</script>

<template>
  <div class="goods">
    <div class="title">
      <h3>{{ title }}</h3>
    </div>
    <div class="goods-container container">
      <ul class="goods-items">
        <li class="goods-item-box" v-for="item in goodsItemList" :key="item.id">
          <RouterLink :to="`/detail/product/${item.skuId}`" class="goods-item">
            <div class="img">
              <el-image :src="item.defaultImage.imgUrl"></el-image>
            </div>
            <div class="spu-name ellipsis">
              <span>{{ item.spuName }}</span>
            </div>
            <div class="spu-price">
              <div class="real-price">
                <span>&yen;{{ parseFloat(item.price).toFixed(2) }}</span>
              </div>
              <div class="market-price">
                <span>&yen;{{ parseFloat(item.marketPrice).toFixed(2) }}</span>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.goods-items {
  display: flex;
  flex-wrap: wrap;

  .goods-item-box:nth-child(n + 6) {
    margin-top: 20px;
  }
  .goods-item-box {
    width: 248px;
  }

  .goods-item:hover {
    box-shadow: 0px 0px 7px 10px rgba(56, 56, 56, 0.09);
  }

  .goods-item {
    margin: 0 auto;
    font-family: 'dingding', sans-serif;
    border-radius: 10px;
    transition: 0.3s all ease;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 230px;
    height: 300px;

    .spu-name {
      text-align: center;
      width: 164px;

      span {
        color: #333;
      }
    }

    .img {
      .el-image {
        width: 160px;
        height: 160px;
        margin-top: 10px;
        margin-bottom: 20px;
      }
    }

    .spu-price {
      margin-top: 10px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;

      .real-price {
        color: $priceColor;
        font-size: 16px;
        margin-right: 5px;
      }

      .market-price {
        color: #999;
        text-decoration: line-through;
      }
    }
  }
}
</style>
