import request from '@/utils/request'
export const confirmOrderApi = () => request.get('/order/order/confirmOrder')
export const submitOrderApi = (submitOrderData) => request.post('/order/order/submitOrder', submitOrderData)
