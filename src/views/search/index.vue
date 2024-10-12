<script setup>
import PageHeaderVue from '@/components/PageHeader.vue'
import { ref, watch } from 'vue'
import { searchProductApi } from '@/api/search'
import { useRoute, useRouter } from 'vue-router'
import qs from 'qs'
document.body.scrollTop = 0
const isMultiBrand = ref(false)
const checkBrandList = ref([])
const checkAttrList = ref([])
const categoryList = ref([])
const brandList = ref([])
const goodsList = ref([])
const attrList = ref([])
const route = useRoute()
const router = useRouter()
const searchResult = ref({})
const searchParam = ref({
  keyWord: '',
  category1Id: '',
  category2Id: '',
  category3Id: '',
  sort: '',
  hasStock: '',
  price: '',
  brandId: [],
  attrs: [],
  pageNum: 1
})
const params = ref('')
const total = ref(0)
const isMultiAttrList = ref([])
const buildParams = () => {
  params.value = qs.stringify(searchParam.value, { arrayFormat: 'repeat' })
  console.log(params.value)
}
watch(
  () => route.fullPath,
  () => {
    searchProduct()
  }
)
const loading = ref(false)
const isSortSale = ref(false)
const isNoSortActive = ref(true)
const isSortPrice = ref(false)
const sortToPrice = ref(0)
const showHasStock = ref(false)
const searchProduct = async () => {
  loading.value = true
  console.log(route.query)
  searchParam.value.keyWord = route.query.keyWord
  searchParam.value.brandId = route.query.brandId || []
  searchParam.value.category2Id = route.query.category2Id
  searchParam.value.category1Id = route.query.category1Id
  searchParam.value.category3Id = route.query.category3Id
  searchParam.value.hasStock = route.query.hasStock
  searchParam.value.price = route.query.price
  searchParam.value.sort = route.query.sort
  searchParam.value.pageNum = route.query.pageNum
  searchParam.value.attrs = []
  if (typeof route.query.attrs === 'string') {
    const str = route.query.attrs
    searchParam.value.attrs[0] = str
  } else {
    searchParam.value.attrs = route.query.attrs || []
  }
  if (searchParam.value.sort) {
    if (searchParam.value.sort === 'saleCount_desc') {
      isSortSale.value = true
      isNoSortActive.value = false
      isSortPrice.value = false
      sortToPrice.value = 0
    } else if (searchParam.value.sort === 'price_asc') {
      isSortSale.value = false
      isNoSortActive.value = false
      isSortPrice.value = true
      sortToPrice.value = 2
    } else if (searchParam.value.sort === 'price_desc') {
      isSortSale.value = false
      isNoSortActive.value = false
      isSortPrice.value = true
      sortToPrice.value = 1
    }
  } else {
    isNoSortActive.value = true
    isSortSale.value = false
    isSortPrice.value = false
    sortToPrice.value = 0
  }
  if (searchParam.value.hasStock) {
    showHasStock.value = true
  } else {
    showHasStock.value = false
  }
  buildParams()
  const res = await searchProductApi(params.value)
  searchResult.value = res.data
  categoryList.value = searchResult.value.categoryList
  brandList.value = searchResult.value.brandList
  attrList.value = searchResult.value.attrList
  goodsList.value = res.data.goods
  for (let i = 0; i < searchResult.value.attrList.length; i++) {
    isMultiAttrList.value[i] = false
    checkAttrList.value[i] = []
  }
  total.value = searchResult.value.total
  loading.value = false
}
searchProduct()

const searchByCategory = (item) => {
  if (item.level === '1') {
    searchParam.value.category1Id = item.categoryId
  } else if (item.level === '2') {
    searchParam.value.category2Id = item.categoryId
  } else if (item.level === '3') {
    searchParam.value.category3Id = item.categoryId
  }
  searchParam.value.pageNum = 1
  buildParams()
  router.replace(`/search?${params.value}`)
}
const searchByBrand = (brandId) => {
  searchParam.value.brandId = []
  searchParam.value.brandId.push(brandId)
  searchParam.value.pageNum = 1
  buildParams()
  router.replace(`/search?${params.value}`)
}
const isMulti = ref(false)
const multiBrandHandler = () => {
  isMultiBrand.value = !isMultiBrand.value
  isMulti.value = isMultiStyle()
  searchParam.value.brandId = []
}
const checkBrandHandler = (index) => {
  if (checkBrandList.value[index]) {
    searchParam.value.brandId.push(brandList.value[index].brandId)
  } else {
    searchParam.value.brandId.splice(index, 1)
  }
  buildParams()
}
let i = 0
const searchByAttr = (item, value) => {
  const attrId = item.attrId
  let flag = false
  for (let i = 0; i < searchParam.value.attrs.length; i++) {
    const attr = searchParam.value.attrs[i].split('_')
    if (+attr[0] === item.attrId) {
      flag = true
      break
    }
  }
  if (!flag) {
    i++
    searchParam.value.attrs.push(`${attrId}_${value}`)
  }
  searchParam.value.pageNum = 1
  buildParams()
  router.replace(`/search?${params.value}&attr_count=${i}`)
}
const multiAttrHandler = (index) => {
  isMultiAttrList.value[index] = !isMultiAttrList.value[index]
  isMulti.value = isMultiStyle()
}
const isMultiStyle = () => {
  let flag = false
  for (let i = 0; i < isMultiAttrList.value.length; i++) {
    if (isMultiAttrList.value[i]) {
      flag = true
      break
    }
  }
  if (isMultiBrand.value || flag) {
    return true
  } else {
    return false
  }
}

const submitSearchParamHandler = () => {
  for (let i = 0; i < checkAttrList.value.length; i++) {
    if (checkAttrList.value[i].length > 0) {
      const attrId = attrList.value[i].attrId
      const attrValue = checkAttrList.value[i].join(':')
      searchParam.value.attrs.push(`${attrId}_${attrValue}`)
    }
  }
  searchParam.value.pageNum = 1
  buildParams()
  i++
  router.replace(`/search?${params.value}&attr_count=${i}`)
  isMulti.value = false
  isMultiBrand.value = false
  for (let i = 0; i < isMultiAttrList.value.length; i++) {
    isMultiAttrList.value[i] = false
  }
  checkAttrList.value = []
  checkBrandList.value = []
}

const noSortHandler = () => {
  searchParam.value.sort = ''
  isSortSale.value = false
  isSortPrice.value = false
  searchParam.value.pageNum = 1
  buildParams()
  router.replace(`/search?${params.value}`)
}

const sortSaleCountHandler = () => {
  searchParam.value.sort = 'saleCount_desc'
  isSortSale.value = true
  isSortPrice.value = false
  isNoSortActive.value = false
  searchParam.value.pageNum = 1
  buildParams()
  router.replace(`/search?${params.value}`)
}

const sortPriceHandler = () => {
  isSortPrice.value = true
  isSortSale.value = false
  isNoSortActive.value = false
  searchParam.value.pageNum = 1
  if (sortToPrice.value === 0) {
    sortToPrice.value = 1
  } else if (sortToPrice.value === 1) {
    sortToPrice.value = 2
  } else if (sortToPrice.value === 2) {
    sortToPrice.value = 1
  }
  if (sortToPrice.value === 1) {
    searchParam.value.sort = 'price_desc'
  } else if (sortToPrice.value === 2) {
    searchParam.value.sort = 'price_asc'
  }
  buildParams()
  router.replace(`/search?${params.value}`)
}

const currentPageNumChangeHandler = (num) => {
  searchParam.value.pageNum = num
  buildParams()
  router.replace(`/search?${params.value}`)
}

const closeNavHandler = (nav) => {
  console.log(nav)
  const lastParams = params.value.replace(nav.link, '')
  i++
  router.replace(`/search?${lastParams}&attr_count=${i}`)
}

const triggerHasStock = () => {
  showHasStock.value = !showHasStock.value
  if (showHasStock.value) {
    searchParam.value.hasStock = true
  } else {
    searchParam.value.hasStock = ''
  }
  searchParam.value.pageNum = 1
  buildParams()
  i++
  router.replace(`/search?${params.value}&attr_count=${i}`)
}
</script>
<template>
  <PageHeaderVue title="搜索结果"></PageHeaderVue>
  <div class="search" v-loading="loading" element-loading-text="玩命加载中。。。">
    <h3 class="search-total">
      共找到<span>{{ searchResult.total }}</span
      >件商品
    </h3>
    <div class="agg">
      <div class="agg-container">
        <div class="nav">
          <el-tag
            class="nav-tag"
            @close="closeNavHandler(tag)"
            v-for="tag in searchResult.navs"
            :key="tag.navName"
            type="danger"
            closable
          >
            {{ tag.navName }}："{{ tag.navValue }}"
          </el-tag>
        </div>
        <div class="search-submit">
          <button class="btn" :class="{ show: isMulti }" @click.prevent="submitSearchParamHandler">确定</button>
        </div>
        <div class="agg-item" v-if="categoryList.length !== 0">
          <div class="agg-title"><span class="ellipsis">分类：</span></div>
          <ul class="items" v-if="!isMultiCategory">
            <li class="item ellipsis" v-for="item in searchResult.categoryList" :key="item.categoryId">
              <span @click="searchByCategory(item)">{{ item.categoryName }}</span>
            </li>
          </ul>
        </div>
        <div class="agg-item" v-if="brandList.length !== 0">
          <div class="agg-title"><span class="ellipsis">品牌：</span></div>
          <div class="items" v-if="isMultiBrand">
            <el-checkbox
              class="brand-check-item"
              v-for="(item, index) in searchResult.brandList"
              v-model="checkBrandList[index]"
              :key="item.brandId"
              @change="checkBrandHandler(index)"
            >
              <div class="box"><el-image fit="contain" :src="item.brandImg"></el-image></div>
            </el-checkbox>
          </div>
          <ul class="items brand" v-if="!isMultiBrand">
            <li
              class="item"
              v-for="item in searchResult.brandList"
              :key="item.brandId"
              @click="searchByBrand(item.brandId)"
            >
              <el-image fit="contain" :src="item.brandImg"></el-image>
            </li>
          </ul>
          <div class="multi">
            <button class="btn" @click.prevent="multiBrandHandler">{{ isMultiBrand ? '取消' : '+多选' }}</button>
          </div>
        </div>
        <div class="agg-item" v-for="(item, index) in searchResult.attrList" :key="index">
          <div class="agg-title">{{ item.attrName }}：</div>
          <el-checkbox-group
            class="items"
            @change="changeAttrCheckHandler"
            v-model="checkAttrList[index]"
            v-if="isMultiAttrList[index]"
          >
            <el-checkbox v-for="(value, idx) in item.attrValues" :key="idx" :label="value" />
          </el-checkbox-group>
          <ul class="items" v-if="!isMultiAttrList[index]">
            <li class="item ellipsis" v-for="(value, idx) in item.attrValues" :key="idx">
              <span @click="searchByAttr(item, value)">{{ value }}</span>
            </li>
          </ul>
          <div class="multi">
            <button class="btn" @click="multiAttrHandler(index)">
              {{ isMultiAttrList[index] ? '取消' : '+多选' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="sort-nav">
        <button class="btn" :class="{ noSortActive: isNoSortActive }" @click="noSortHandler">综合</button>
        <div class="sort-sale">
          <button class="btn" :class="{ saleActive: isSortSale }" @click="sortSaleCountHandler">
            销量<i class="iconfont icon-xia"></i>
          </button>
        </div>
        <div class="sort-price">
          <button class="btn" :class="{ priceActive: isSortPrice }" @click="sortPriceHandler">
            价格
            <i class="iconfont icon-jiantou_xiangxia" :class="{ xiangxia: sortToPrice === 1 }"></i>
            <i class="iconfont icon-jiantou_xiangshang" :class="{ xiangshang: sortToPrice === 2 }"></i>
          </button>
        </div>
        <div class="only-stock" :class="{ isActive: showHasStock }" @click="triggerHasStock">
          <div class="check-box">
            <i class="iconfont icon-check"></i>
          </div>
          <div class="content">仅看有货</div>
        </div>
      </div>
      <div class="goods-container">
        <ul class="goods-items" v-if="goodsList.length !== 0">
          <li class="goods-item-box" v-for="item in goodsList" :key="item.skuId">
            <RouterLink :to="`/detail/product/${item.skuId}`" class="goods-item">
              <div class="img">
                <el-image :src="item.image"></el-image>
              </div>
              <div class="sku-name ellipsis-2">
                <span v-html="item.title"></span>
              </div>
              <div class="sku-price">
                <div class="real-price">
                  <span>&yen;{{ parseFloat(item.price).toFixed(2) }}</span>
                </div>
                <div class="sale">
                  <span>销量：{{ item.saleCount }}</span>
                </div>
              </div>
            </RouterLink>
          </li>
        </ul>
        <div v-else class="goods-empty">未找到相关商品</div>
      </div>
      <el-pagination
        v-if="goodsList.length !== 0"
        class="page-nav"
        background
        layout="prev, pager, next"
        @current-change="currentPageNumChangeHandler"
        :page-size="15"
        :total="total"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.search {
  &-total {
    text-align: center;
    padding: 30px 0;
    font-size: 20px;
    letter-spacing: 2px;
    font-family: 'dingding', sans-serif;
    span {
      color: red;
    }
  }
  padding-bottom: 100px;
  background-color: #fff;
  .search-submit {
    display: flex;
    justify-content: right;
    .btn {
      opacity: 0;
      cursor: pointer;
      font-family: 'dingding', sans-serif;
      border-radius: 5px;
      color: #fff;
      background-color: $primaryColor;
      border: 0;
      width: 60px;
      height: 30px;
      letter-spacing: 2px;
      transition: 0.3s all ease;
      &:hover {
        background-color: #333;
      }
    }
    .show {
      opacity: 1;
    }
  }
}

.nav {
  display: flex;
  flex-wrap: wrap;
  &-tag {
    margin-top: 10px;
    margin-right: 20px;
  }
}
.agg {
  background-color: #f5f5f5;
  padding: 20px 0;
  &-container {
    width: 1240px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    .agg-title {
      font-family: 'dingding', sans-serif;
      display: flex;
      align-items: center;
      font-size: 16px;
      width: 100px;
    }
    .agg-item {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
      .multi {
        width: 60px;
        .btn {
          font-family: 'dingding', sans-serif;
          background-color: #fff;
          color: #333;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 50px;
          cursor: pointer;
          transition: 0.3s all ease;
          &:hover {
            background-color: $primaryColor;
            color: #fff;
          }
        }
      }
      .items {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }
      .item {
        span {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          transition: 0.3s all ease;
          cursor: pointer;
          &:hover {
            color: $primaryColor;
          }
        }
      }
      .item:not(:last-child)::after {
        content: '|';
        color: #ccc;
        margin: 0 10px;
      }

      .brand {
        .item::after {
          content: '';
        }
        .item {
          height: 77px;
          cursor: pointer;
          width: 15%;
          transition: 0.3s all ease;
          border: 1px solid #ccc;
          .el-image {
            width: 100%;
            height: 75px;
          }
          &:hover {
            box-shadow: 0px 0px 7px rgb(56, 56, 56);
          }
        }

        .item {
          margin-right: 20px;
        }
        .item:nth-child(n + 6) {
          margin-top: 10px !important;
        }
      }
    }
  }
}
.sort-nav {
  align-items: center;
  display: flex;
  padding: 25px 10px;
  .btn {
    border-radius: 5px;
    font-family: 'dingding', sans-serif;
    border: 1px solid #ccc;
    background-color: #fff;
    letter-spacing: 2px;
    font-size: 16px;
    width: 100px;
    height: 30px;
    cursor: pointer;
    transition: 0.3s all ease;
    &:hover {
      background-color: $primaryColor;
      color: #fff;
    }
  }
  .sort-sale {
    margin-left: 15px;
  }
  .sort-price {
    margin-left: 15px;
    .btn {
      letter-spacing: 0px;
    }
  }
  .noSortActive {
    background-color: $primaryColor;
    color: #fff;
  }
  .saleActive {
    background-color: $primaryColor;
    color: #fff;
  }
  .priceActive {
    background-color: $primaryColor;
    color: #fff;
  }
  .xiangxia {
    color: $yellowColor;
  }
  .xiangshang {
    color: $yellowColor;
  }

  .only-stock {
    margin-left: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    .check-box {
      border: 2px solid #333;
      width: 20px;
      height: 20px;
      transition: 0.3s all ease;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont {
        transition: 0.3s all ease;
        font-size: 16px;
        color: $primaryColor;
        opacity: 0;
      }
    }
    .content {
      transition: 0.3s all ease;
      color: #333;
      margin-left: 5px;
      font-family: 'dingding';
      font-size: 16px;
    }
  }
  .only-stock.isActive {
    .check-box {
      border: 2px solid $primaryColor;
      .iconfont {
        opacity: 1;
      }
    }
    .content {
      color: $primaryColor;
    }
  }
}
.brand-check {
  &-item {
    height: 80px;
    .box {
      height: 77px;
      border: 1px solid #ccc;
      .el-image {
        width: 150px;
        height: 75px;
      }
    }
  }
}
.goods-container {
  margin-bottom: 50px;
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
    margin: 0 auto;
    border: 1px solid #e9e2e2;
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

    .sku-name {
      text-align: left;
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

    .sku-price {
      width: 100%;

      margin-top: 10px;
      display: flex;
      align-items: baseline;
      justify-content: space-around;

      .real-price {
        color: $priceColor;
        font-size: 16px;
        margin-right: 5px;
      }
      .sale {
        color: #333;
      }
    }
  }
}

.goods-empty {
  font-size: 25px;
  padding: 30px 0;
  font-family: 'dingding', sans-serif;
  text-align: center;
}
</style>
