import request from '@/utils/request'

export const getHomeBrandListApi = (catSubType) => request.get(`/product/open/brand/homeBrand/${catSubType}`)
