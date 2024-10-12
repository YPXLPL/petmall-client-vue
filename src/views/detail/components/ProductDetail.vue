<script setup>
import { getGoodsDetailBySkuIdApi } from '@/api/goods'
import { computed, nextTick, ref, watch } from 'vue'
import { useMouseInElement, useResizeObserver } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, useCartStore } from '@/stores/index.js'
import { message } from '@/utils/resetMessage'
import { addCartItemApi } from '@/api/cart'
const userStore = useUserStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()
const skuId = computed(() => {
  return +route.params.id
})
const saleAttrSelect = ref('')
const goodsDetail = ref({})
const activeImg = ref({})
const skuInfo = ref({})
const saleAttrs = ref([])
const specAttrs = ref([])
const stock = ref({})
const descImages = ref([])
const loading = ref(false)
const getGoodsDetailBySkuId = async () => {
  loading.value = true
  const res = await getGoodsDetailBySkuIdApi(route.params.id)
  goodsDetail.value = res.data
  activeImg.value = goodsDetail.value.images.find((item) => item.defaultImg === 1)
  skuInfo.value = goodsDetail.value.skuInfo
  saleAttrs.value = goodsDetail.value.saleAttrs
  specAttrs.value = goodsDetail.value.specAttrs
  saleAttrSelect.value = skuId.value
  stock.value = goodsDetail.value.stock
  descImages.value = goodsDetail.value.descImages
  nextTick(() => {
    useResizeObserver(owlImgConatinerRef, (entries) => {
      const entry = entries[0]
      const { inlineSize } = entry.borderBoxSize[0]
      owlImgContainerWidth.value = inlineSize
    })
    useResizeObserver(owlImgItem.value[0], (entries) => {
      const entry = entries[0]
      const { inlineSize } = entry.borderBoxSize[0]
      owlImgContainerInvisibleWidth.value =
        inlineSize * goodsDetail.value.images.length +
        12 * (goodsDetail.value.images.length - 1) -
        owlImgContainerWidth.value
    })
  })
  loading.value = false
}
getGoodsDetailBySkuId()
const setRef = (el) => {
  owlImgItem.value.push(el)
}
const owlImgConatinerRef = ref()
const owlImgItem = ref([])
const owlImgContainerInvisibleWidth = ref(0)
const owlImgContainerWidth = ref(0)
const changeOwlImgHandler = (index) => {
  activeImg.value = goodsDetail.value.images[index]
}

const transformStyle = ref({})
const locationIndex = ref(0)
const prevOwlImgHandler = () => {
  locationIndex.value--
  let width = locationIndex.value * 150.5
  if (width < 0) {
    locationIndex.value = 0
    return
  }
  currentLocation.value = width
  return (transformStyle.value = {
    transform: `translateX(-${currentLocation.value}px)`
  })
}
const currentLocation = ref(0)
const nextOwlImgHandler = () => {
  locationIndex.value++
  let width = locationIndex.value * 150.5
  if (width > owlImgContainerInvisibleWidth.value) {
    locationIndex.value--
    return
  }
  currentLocation.value = width
  return (transformStyle.value = {
    transform: `translateX(-${currentLocation.value}px)`
  })
}

const target = ref()
const { elementX, elementY, isOutside } = useMouseInElement(target)
const left = ref(0)
const top = ref(0)
const positionX = ref(0)
const positionY = ref(0)
watch([elementX, elementY, isOutside], () => {
  // 如果鼠标没有移入到盒子里面 直接不执行后面的逻辑
  if (isOutside.value) return

  // 横向
  if (elementX.value > 147.5 && elementX.value < 442.5) {
    left.value = elementX.value - 147.5
  }
  // 纵向
  if (elementY.value > 147.5 && elementY.value < 442.5) {
    top.value = elementY.value - 147.5
  }

  // 处理边界
  if (elementX.value > 442.5) {
    left.value = 295
  }
  if (elementX.value < 147.5) {
    left.value = 0
  }

  if (elementY.value > 442.5) {
    top.value = 295
  }
  if (elementY.value < 147.5) {
    top.value = 0
  }

  // 控制大图的显示
  positionX.value = -left.value * 2
  positionY.value = -top.value * 2
})

const value = ref(5)
const rateColors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

const buyCount = ref(1)
const changeBuyNumberHandler = (value) => {
  if (value > stock.value.stock) {
    buyCount.value = stock.value.stock
    return
  }
  if (value <= 0) {
    buyCount.value = 1
  }
}

const changeSkuSaleAttrHandler = (val) => {
  router.replace(`/detail/product/${val}`)
}
watch(
  () => route.params.id,
  () => {
    getGoodsDetailBySkuId()
  }
)

const currentGoodsDescNavIndex = ref(0)
const changeDescNavIndexHandler = (index) => {
  currentGoodsDescNavIndex.value = index
}

const backToHomeHandler = () => {
  router.push('/home')
}

const addCartHandler = async () => {
  if (!userStore.user.username) {
    message.error('请先登录')
    router.push('/login')
    return
  }
  const res = await addCartItemApi(skuId.value, buyCount.value)
  message.success(res.msg)
  cartStore.getCartList()
}

const notifyHandler = () => {
  if (!userStore.user.username) {
    message.error('请先登录')
    router.push('/login')
    return
  }
}
const addToFavorHandler = () => {
  if (!userStore.user.username) {
    message.error('请先登录')
    router.push('/login')
    return
  }
}
</script>

<template>
  <div class="goods-detail" v-if="goodsDetail" v-loading="loading" element-loading-text="玩命加载中。。。">
    <div class="container">
      <el-row class="goods-detail-row" v-loading="loading" element-loading-text="玩命加载中。。。">
        <el-col :span="12" class="col-1">
          <div class="goods-detail-img">
            <div class="main-img-container">
              <div class="main-img" ref="target">
                <div
                  class="zoomContainer"
                  :style="[
                    {
                      backgroundImage: `url(${activeImg.imgUrl})`,
                      backgroundPositionX: `${positionX}px`,
                      backgroundPositionY: `${positionY}px`
                    }
                  ]"
                  v-show="!isOutside"
                ></div>
                <el-image fit="contain" :src="activeImg.imgUrl"></el-image>
              </div>
            </div>
            <div class="include-img-container">
              <div class="owl-prev" @click="prevOwlImgHandler">
                <i class="iconfont icon-zhixiangzuo"></i>
              </div>
              <div class="owl-img" ref="owl">
                <ul class="img-items" ref="owlImgConatinerRef" :style="transformStyle">
                  <li
                    class="img-item clearfix:after"
                    :ref="setRef"
                    @click="changeOwlImgHandler(index)"
                    v-for="(item, index) in goodsDetail.images"
                    :key="item.id"
                  >
                    <el-image :src="item.imgUrl" fit="contain"></el-image>
                  </li>
                </ul>
              </div>
              <div class="owl-next" @click="nextOwlImgHandler">
                <i class="iconfont icon-zhixiangyou"></i>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="col-2">
          <div class="goods-detail-include">
            <div class="goods-name ellipsis-2">
              <el-tooltip class="box-item" effect="light" :content="skuInfo.skuName" placement="left-start">
                <h2>{{ skuInfo.skuName }}</h2>
              </el-tooltip>
            </div>
            <div class="goods-desc ellipsis-2">
              <el-tooltip class="box-item" effect="light" :content="skuInfo.skuName" placement="bottom">
                <h3>{{ skuInfo.skuDesc }}</h3>
              </el-tooltip>
            </div>
            <div class="goods-rate">
              <el-rate v-model="value" size="large" :max="5" :disabled="true" :colors="rateColors" />
              <div class="review-num">{{ '10' }} 评价</div>
            </div>
            <div class="goods-price">
              <div class="real-price">
                <span>&yen;{{ parseFloat(skuInfo.price).toFixed(2) }}</span>
              </div>
              <div class="market-price">
                <span>&yen;{{ parseFloat(skuInfo.marketPrice).toFixed(2) }}</span>
              </div>
            </div>
            <div class="goods-stock">
              <span v-if="stock.hasStock" class="has-stock">现货 - 在售</span>
              <span v-else class="no-stock">商品无货</span>
            </div>
            <div class="goods-sale">
              <span>月销：{{ skuInfo.saleCount }} 件</span>
            </div>
            <div class="goods-other">
              <el-tooltip
                class="box-item"
                effect="light"
                content="正规授权，所有商品可100%追溯来源。"
                placement="bottom"
              >
                <div class="goods-other-item">
                  <i class="iconfont icon-zhengpinbaozheng"></i>
                  <span>正品保证</span>
                </div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="light" content="全场商品免运费" placement="bottom">
                <div class="goods-other-item middle">
                  <i class="iconfont icon-mianyunfei"></i>
                  <span>全场免运</span>
                </div>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="light"
                content="在不影响该商品二次销售的情况下，自收到商品7天内，一切质量问题可申请无理由退换货服务。"
                placement="bottom"
              >
                <div class="goods-other-item">
                  <i class="iconfont icon-qitianwuliyoutuihuo"></i>
                  <span>七天无理由</span>
                </div>
              </el-tooltip>
            </div>
            <div class="goods-sale-attr">
              <ul class="sale-attr-items">
                <li class="sale-attr-item" v-for="(item, index) in saleAttrs" :key="index">
                  <div class="sale-attr-group">
                    <span>{{ item.saleAttrGroupName }}：</span>
                  </div>
                  <el-select v-model="saleAttrSelect" size="large" @change="changeSkuSaleAttrHandler">
                    <el-option
                      v-for="value in item.saleAttrValues"
                      :key="value.skuId"
                      :value="value.skuId"
                      :label="value.saleAttrValue"
                    ></el-option>
                  </el-select>
                </li>
              </ul>
            </div>
            <div class="own-to-buy">
              <span>我要买：</span>
              <el-input-number
                v-model="buyCount"
                class="buy-num"
                :min="1"
                :max="stock.stock"
                @change="changeBuyNumberHandler"
                :disabled="!stock.hasStock"
              ></el-input-number>
              <div class="stock-num">库存：{{ stock.stock }}</div>
            </div>
            <div class="add-to">
              <button class="add-to-cart" v-if="stock.hasStock" @click="addCartHandler">加入购物车</button>
              <button class="add-to-cart" v-else @click="notifyHandler">通知添货</button>
              <button class="add-to-collection" title="收藏" @click.prevent="addToFavorHandler">
                <i class="iconfont icon-aixin1"></i>
              </button>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="goods-desc-container">
        <div class="goods-desc-nav">
          <div
            @click="changeDescNavIndexHandler(0)"
            :class="{ active: currentGoodsDescNavIndex === 0 }"
            class="goods-desc-nav-item goods-description"
          >
            <h3>商品详情</h3>
          </div>
          <div
            @click="changeDescNavIndexHandler(1)"
            :class="{ active: currentGoodsDescNavIndex === 1 }"
            class="goods-desc-nav-item goods-spec-attr"
          >
            <h3>规格参数</h3>
          </div>
          <div
            @click="changeDescNavIndexHandler(2)"
            :class="{ active: currentGoodsDescNavIndex === 2 }"
            class="goods-desc-nav-item goods-comments"
          >
            <h3>评论区(999+)</h3>
          </div>
        </div>
        <div class="context-container">
          <div v-if="currentGoodsDescNavIndex === 0" class="goods-desc-images">
            <el-image v-for="item in descImages" :key="item.id" :src="item.imgUrl"></el-image>
          </div>
          <div v-if="currentGoodsDescNavIndex === 1" class="goods-spec-attr">
            <div class="main-spec">
              <div class="product-id">
                <span>商品编号：{{ skuInfo.skuId }}</span>
              </div>
              <div class="product-weight">
                <span>重量：{{ parseFloat(skuInfo.weight).toFixed(3) }} KG</span>
              </div>
            </div>
            <ul class="spec-attr-items" v-if="specAttrs !== undefined && specAttrs.length !== 0">
              <li class="spec-attr-item" v-for="(item, index) in specAttrs" :key="index">
                <div class="spec-attr-group-name">
                  <h4>{{ item.groupName }}</h4>
                </div>
                <ul class="spec-attr-item-values">
                  <li class="spec-attr-item-value" v-for="(item, index) in item.attrs" :key="index">
                    <div class="spec-attr-item-name">
                      <span>{{ item.attrName }}：</span>
                    </div>
                    <div class="spec-attr-item-value">
                      <span>{{ item.attrValues }}</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="spec-attr-empty" v-else>
              <h3>暂无其他规格参数</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="goods-empty" v-else>
    <el-empty description="商品已下架">
      <button class="empty-btn" @click="backToHomeHandler">回到商城</button>
    </el-empty>
  </div>
</template>

<style lang="scss" scoped>
.goods-empty {
  background-color: #fff;
  padding: 100px 0;

  .empty-btn {
    cursor: pointer;
    padding: 20px 50px;
    font-size: 18px;
    border: 0;
    border-radius: 5px;
    color: #fff;
    font-family: 'dingding', sans-serif;
    background-color: $primaryColor;
    transition: 0.3s all ease;
  }

  .empty-btn:hover {
    background-color: #000;
  }
}

.el-empty ::v-deep .el-empty__description p {
  font-family: 'dingding', sans-serif;
  font-size: 20px !important;
}

.goods-detail {
  background-color: #fff;

  .container {
    padding-top: 100px;
    padding-bottom: 100px;
  }
}

.goods-detail-row {
  padding-bottom: 100px;
}

.col-1 {
  position: relative;
  padding-right: 15px;
  padding-left: 15px;
}

.goods-detail-img {
  .main-img-container {
    width: 100%;
    display: flex;
    justify-content: end;
  }

  .main-img {
    width: 100%;
    height: 590px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
    position: relative;

    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  .zoomContainer {
    z-index: 88;
    position: absolute;
    width: 588px;
    height: 588px;
    top: 0;
    left: 0;
    cursor: crosshair;
    background-color: rgba($color: #000000, $alpha: 0.8);
    background-repeat: no-repeat;
    background-size: 1180px 1180px;
    background-color: #f8f8f8;
  }
}

.include-img-container {
  margin-top: 15px;
  width: 100%;
  height: 130px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.owl-prev {
  position: absolute;
  left: 0;
  z-index: 88;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgba($color: #fff, $alpha: 0.9);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transform: translateX(-50%);
  color: #8d8c8c;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;

  .iconfont {
    font-size: 25px;
    line-height: 50px;
  }
}

.owl-next {
  position: absolute;
  right: 0;
  z-index: 88;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgba($color: #fff, $alpha: 0.9);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transform: translateX(50%);
  color: #8d8c8c;
  text-align: center;
  transition: all 0.3s ease 0s;
  opacity: 0;

  .iconfont {
    font-size: 25px;
    line-height: 50px;
  }
}

.owl-prev:hover {
  background-color: rgba($color: $primaryColor, $alpha: 0.9);
  color: #fff;
}

.owl-next:hover {
  background-color: rgba($color: $primaryColor, $alpha: 0.9);
  color: #fff;
}

.include-img-container:hover {
  .owl-prev {
    opacity: 1;
  }

  .owl-next {
    opacity: 1;
  }
}

.owl-img {
  overflow: hidden;
}

.img-items {
  width: 100%;
  height: 138.5px;
  display: flex;
  align-items: center;
  transition: 0.3s all linear;
  transform: translateX(0);
}

.img-item {
  cursor: pointer;
  width: 138.5px;
  height: 138.5px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-image {
    width: 136.5px;
    height: 136.5px;
  }
}

.img-item:not(:last-child) {
  margin-right: 12px;
}

.col-2 {
  font-family: 'dingding', sans-serif;
  position: relative;
  padding-right: 20px;
  padding-left: 20px;
}

.goods-detail-include {
  .goods-name {
    h2 {
      color: #585858;
      font-size: 25px;
      margin: 0 0 7px;
    }
  }

  .goods-desc {
    margin-top: 20px;

    h3 {
      color: $goodsDescColor;
      font-size: 18px;
      margin: 0 0 7px;
    }
  }

  .goods-rate {
    margin: 25px 0;
    display: flex;
    align-items: center;

    .review-num {
      font-size: 20px;
      margin-left: 10px;
    }
  }

  .goods-price {
    display: flex;
    align-items: baseline;

    .real-price {
      span {
        color: $priceColor;
        font-size: 32px;
        margin-right: 10px;
      }
    }

    .market-price {
      span {
        color: #8d8c8c;
        font-size: 16px;
        text-decoration: line-through;
      }
    }
  }

  .goods-stock {
    margin: 40px 0 20px;

    .has-stock {
      color: #93c241;
      font-size: 20px;
      letter-spacing: 2px;
    }

    .no-stock {
      color: $dangerColor;
      font-size: 20px;
      letter-spacing: 2px;
    }
  }

  .goods-sale {
    span {
      font-size: 18px;
      letter-spacing: 2px;
    }
  }

  .goods-sale-attr {
    padding: 30px 0;

    .sale-attr-items {
      .sale-attr-item:not(:first-child) {
        margin-top: 10px;
      }

      .sale-attr-item {
        width: 100%;
        display: flex;
        align-items: center;
      }

      .sale-attr-group {
        width: 70px;

        span {
          letter-spacing: 2px;
          font-size: 18px;
          color: #454545;
        }
      }
    }
  }

  .own-to-buy {
    display: flex;
    align-items: center;
    padding: 10px 0;

    span {
      letter-spacing: 2px;
      font-size: 18px;
      color: #454545;
    }

    .stock-num {
      margin-left: 20px;
      color: #454545;
    }
  }

  .add-to {
    padding: 30px 0;
    display: flex;
    align-items: center;

    &-cart {
      cursor: pointer;
      transition: 0.3s all ease;
      font-family: 'dingding', sans-serif;
      background-color: $primaryColor;
      color: #fff;
      display: inline-block;
      font-size: 18px;
      width: 150px;
      height: 50px;
      letter-spacing: 3px;
      border: 0;
      border-radius: 5px;
    }

    &-cart:hover {
      background-color: #333;
    }

    &-collection {
      cursor: pointer;
      background-color: #fff;
      border-radius: 5px;
      border: 1px solid #dcdcdc;
      margin-left: 20px;
      width: 60px;
      height: 50px;
      transition: 0.3s all ease;

      .iconfont {
        transition: 0.3s all ease;
        font-size: 20px;
      }
    }

    &-collection:hover {
      background-color: $primaryColor;

      .iconfont {
        color: #fff;
      }
    }
  }

  .goods-other {
    padding-top: 20px;
    display: flex;

    .middle::before {
      cursor: default;
      margin: 0 10px;
      content: '';
      display: block;
      width: 2px;
      height: 18px;
      background-color: $hotLineColor;
    }

    .middle::after {
      cursor: default;
      margin: 0 10px;
      content: '';
      display: block;
      width: 2px;
      height: 18px;
      background-color: $hotLineColor;
    }

    &-item {
      cursor: pointer;
      display: flex;
      align-items: center;

      .iconfont {
        font-size: 25px;
        margin-right: 3px;
        color: $primaryColor;
      }

      span {
        font-size: 16px;
      }
    }
  }
}

.el-rate ::v-deep .el-rate__icon {
  font-size: 30px !important;
}

.el-input-number ::v-deep .el-input__inner {
  color: $primaryColor;
}

.goods-desc-container {
  padding-top: 40px;
  padding-bottom: 40px;
  margin: 0 15px;
  background-color: #f6f6f6;
}

.goods-desc-nav {
  display: flex;
  justify-content: center;

  .goods-description h3::before,
  .goods-spec-attr h3::before {
    background-color: #7a7a7a;
    content: '';
    height: 20px;
    position: absolute;
    right: -37px;
    top: 2px;
    width: 1px;
  }

  .active {
    h3 {
      border-bottom: 2px solid $primaryColor;
      color: $primaryColor;
    }
  }

  &-item {
    h3 {
      cursor: pointer;
      transition: 0.3s all ease-out;
      font-family: 'dingding', sans-serif;
      border-bottom: 2px solid transparent;
      color: #333;
      display: inline-block;
      font-size: 20px;
      font-weight: bold;
      position: relative;
      margin: 0 37px;
      padding-bottom: 13px;
    }
  }
}

.context-container {
  padding: 40px 30px;
}

.goods-desc-images {
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-image {
    width: 790px;
  }
}

.goods-spec-attr {
  .main-spec {
    display: flex;
    font-size: 16px;
    font-weight: bold;
    width: 455px;
    margin: 0 auto;
    padding-bottom: 10px;
    position: relative;

    .product-weight {
      margin-left: 15px;
    }
  }

  .main-spec::after {
    content: '';
    position: absolute;
    width: 1150px;
    top: 130%;
    transform: translateX(-30%);
    border: 1px dashed $hotLineColor;
  }

  .spec-attr-item:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 1150px;
    top: 110%;
    transform: translateX(-30%);
    border: 1px dashed $hotLineColor;
  }

  .spec-attr-items {
    display: flex;
    flex-direction: column;
    align-items: center;

    .spec-attr-item {
      position: relative;
      margin-top: 30px;

      .spec-attr-group-name {
        font-family: 'dingding', sans-serif;
        font-size: 25px;
      }
    }

    .spec-attr-item-values {
      width: 455px;
      margin-top: 10px;
    }

    .spec-attr-item-value {
      display: flex;
      align-items: baseline;
      line-height: 30px;

      .spec-attr-item-name {
        font-size: 16px;
        font-weight: bold;
      }

      .spec-attr-item-value {
        font-size: 16px;
      }
    }
  }

  .spec-attr-empty {
    margin-top: 30px;
    font-family: 'dingding', sans-serif;

    h3 {
      width: 455px;
      margin: 0 auto;
      font-size: 30px;
    }
  }
}
</style>
