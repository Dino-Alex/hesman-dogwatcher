import axios from 'axios'

export const getProductClient = axios.create({
  baseURL: 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/products',
})

export const addProductClient = 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/admin/product/new'

export const deleteProductClient = 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/admin/product/'

export const updateProductClient = 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/admin/product/'

export const getSingleProductClient = axios.create({
  baseURL: 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/product/',
})

export const loginClient = axios.create({
  baseURL: 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/login',
})

export const getTrackingClient = axios.create({
  baseURL: 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/trackings',
})

export const addTrackingClient = 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/admin/tracking/new'

export const deleteTrackingClient = 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/admin/tracking/'

export const updateTrackingClient = 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/admin/tracking/'

export const getSingleTrackingClient = axios.create({
  baseURL: 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/tracking/',
})

export const getTrackingByAddress = axios.create({
  baseURL: 'https://dog-watcher-api.deltalabsjsc.com:4001/api/v1/hes/trackingByAddress/',
})
