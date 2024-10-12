import request from '@/utils/request'
export const getOwnCartListApi = () => request.get('/cart/currentUserCartItems')
export const addCartItemApi = (skuId, num) => request.put(`/cart/addCartItem/${skuId}/${num}`)
export const getTotalPriceApi = () => request.get('/cart/totalPrice')
export const deleteCartItemBySkuIdApi = (skuId) => request.delete(`cart/deleteItem/${skuId}`)
export const updateItemCountApi = (skuId, num) => request.put(`/cart/item/count/${skuId}/${num}`)
export const updateItemCheckApi = (skuId, checked) => request.put(`/cart/item/check/${skuId}/${checked}`)
export const updateAllItemCheckApi = (checked) => request.put(`/cart/all/item/check/${checked}`)
export const cartBackCartItemsApi = (cartBackTo) => request.post('/cart/back/cartItems', cartBackTo)
