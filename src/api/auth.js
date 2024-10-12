import request from '@/utils/request'
import qs from 'qs'

export const authTokenApi = (loginParams) =>
  request.post('/auth/oauth/token', qs.stringify(loginParams), {
    Headers: { 'content-type': 'application/x-www-form-urlencoded' }
  })

export const sendCode = (phone) => request.get('/thirdparty/open/sendCode', { params: { phone } })

export const getUserInfoApi = () => request.get('/auth/user/own')

export const updateAvatarApi = (imgUrl) => request.put('/auth/user/avatar', { data: imgUrl })

export const updatePhoneApi = (phone) => request.put('/auth/user/update/phone', phone)

export const updateMemberPasswordApi = (password) => request.put('/auth/user/update/member/password', password)
