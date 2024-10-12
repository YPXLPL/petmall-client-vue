import request from '@/utils/request'

export const getHomeGoodsListApi = (catSubType) => request.get(`/product/open/goods/homeGoods/${catSubType}`)

export const getGoodsDetailBySkuIdApi = (skuId) => request.get(`/product/open/goods/detail/${skuId}`)

export const getGoodsAndCategoryByBrandIdApi = (brandId) => request.get(`/product/open/goods/brand/${brandId}`)
