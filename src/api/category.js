import request from '@/utils/request'

export const categoryMenuApi = () => request.get('/product/open/category/menu')

export const categorySubMenuApi = (catId) => request.get(`/product/open/category/subMenu/${catId}`)

export const categoryMenuLevel1Api = () => request.get('/product/open/category/menu/level1')
