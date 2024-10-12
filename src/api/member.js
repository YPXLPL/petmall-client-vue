import request from '@/utils/request'
export const updateMemberInfoApi = (memberInfo) => request.put('/member/member-desc/update/info', memberInfo)

export const getMemberInfoApi = () => request.get('/member/member-desc/info')

export const saveAddressApi = (address) => request.post('/member/receive-address/save/address', address)

export const getAddressByIdApi = (id) => request.get(`/member/receive-address/${id}`)

export const updateAddressApi = (address) => request.put('/member/receive-address/update/address', address)

export const getAddressListApi = () => request.get('/member/receive-address/own/list')

export const deleteAddressByIdApi = (id, memberId) => request.delete(`/member/receive-address/${memberId}/${id}`)

export const deleteBatchAddressByIdsApi = (ids, memberId) =>
  request.delete(`/member/receive-address/batch/${memberId}`, {
    data: ids
  })

export const updateDefaultStatusByIdApi = (id, memberId) =>
  request.put(`/member/receive-address/defaultStatus/${id}/${memberId}`)

export const updateCurAddressByIdApi = (id, memberId) =>
  request.put(`/member/receive-address/update/curAddress/${id}/${memberId}`)
