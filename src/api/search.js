import request from '@/utils/request'

export const searchProductApi = (params) => request.get(`/search/list?${params}`)

export const getSuggestionsApi = (key) => request.get('/search/suggestion', { params: { key } })
