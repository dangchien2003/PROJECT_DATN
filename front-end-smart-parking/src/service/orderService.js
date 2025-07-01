import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'


export async function createOrder(data) {
  return await httpClient.post(PARKING_SERVICE.order.createOrder, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function confirmOrder(data) {
  return await httpClient.post(PARKING_SERVICE.order.confirmOrder, data, {
    headers: {
      Authorization: undefined
    }
  })
}
