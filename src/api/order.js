import request from '@/utils/request'
export const confirmOrderApi = () => request.get('/order/order/confirmOrder')
export const submitOrderApi = (submitOrderData) => request.post('/order/order/submitOrder', submitOrderData)
export const getOrderApi = (orderSn) => request.get(`/order/order/getOrder/${orderSn}`)
export const updateOrderAddressApi = (address) => request.put('/order/order/change/address', address)
export const orderCloseBackCartApi = (memberId, orderSn) =>
  request.post(`/order/order-item/back/cart/${memberId}/${orderSn}`)
export const closeOrderApi = (order) => request.delete('/order/order/closeOrder', { data: order })
export const getOrderListApi = (memberId, orderStatus) => request.get(`/order/order/list/${memberId}/${orderStatus}`)
export const getOrderDetailApi = (orderSn) => request.get(`/order/order/detail/${orderSn}`)
export const changeOrderStatusFinishApi = (orderSn) => request.put(`/order/order/finish/${orderSn}`)
export const deleteOrderApi = (memberId, orderSn) => request.delete(`/order/order/${memberId}/${orderSn}`)
