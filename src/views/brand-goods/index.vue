<script setup>
import PageHeader from '@/components/PageHeader.vue'
import { getGoodsAndCategoryByBrandIdApi } from '@/api/goods.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const loading = ref(false)
const route = useRoute()
const brandId = route.params.brandId
const brandGoods = ref([])
const hasGoods = ref(false)
const getGoodsAndCategoryByBrandId = async () => {
  loading.value = true
  const res = await getGoodsAndCategoryByBrandIdApi(brandId)
  brandGoods.value = res.data
  for (let i = 0; i < brandGoods.value.categoryGoodsList.length; i++) {
    if (brandGoods.value.categoryGoodsList[i].goodsItems.length !== 0) {
      hasGoods.value = true
      break
    }
  }
  loading.value = false
}
getGoodsAndCategoryByBrandId()
</script>
<template>
  <PageHeader :title="`${brandGoods.brandName || ''} 品牌专场`"></PageHeader>
  <div class="brand-goods" v-loading="loading">
    <div class="container">
      <div class="has-goods" v-if="hasGoods">
        <div class="brand-goods-item" v-for="item in brandGoods.categoryGoodsList" :key="item.categoryId">
          <div v-if="item.goodsItems.length !== 0" class="brand-goods-item-container">
            <div class="title">
              <h3>{{ item.categoryName }}</h3>
            </div>
            <div class="goods-container container">
              <ul class="goods-items">
                <li class="goods-item-box" v-for="goods in item.goodsItems" :key="goods.id">
                  <RouterLink :to="`/detail/product/${goods.skuId}`" class="goods-item">
                    <div class="img">
                      <el-image :src="goods.defaultImage.imgUrl"></el-image>
                    </div>
                    <div class="spu-name ellipsis">
                      <span>{{ goods.spuName }}</span>
                    </div>
                    <div class="spu-price">
                      <div class="real-price">
                        <span>&yen;{{ parseFloat(goods.price).toFixed(2) }}</span>
                      </div>
                      <div class="market-price">
                        <span>&yen;{{ parseFloat(goods.marketPrice).toFixed(2) }}</span>
                      </div>
                    </div>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-goods" v-else>
        <h2>暂无相关商品</h2>
        <RouterLink to="/">返回首页</RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.brand-goods {
  background-color: #fff;
  padding-top: 50px;
  padding-bottom: 100px;
}

.brand-goods-item:nth-child(2) {
  margin-top: 50px;
}
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
    border: 1px solid #ccc;
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

.empty-goods {
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    font-family: 'dingding', sans-serif;
    font-size: 30px;
    text-align: center;
  }
  a {
    font-family: 'dingding', sans-serif;
    letter-spacing: 2px;
    background-color: $primaryColor;
    color: #fff;
    display: inline-block;
    font-size: 18px;
    width: 150px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 10px;
    transition: 0.3s all ease;
    &:hover {
      background-color: #333;
    }
  }
}
</style>
