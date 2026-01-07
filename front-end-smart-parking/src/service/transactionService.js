import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage } from '@/utils/api'


export async function customerGetHistory(data, page, size) {
  return await httpClient.post(PARKING_SERVICE.transaction.customerSearch + "?" + getParamsPage(page, size, null, null), data, {
  })
}

export async function adminGetHistory(data, page, size) {
  return await httpClient.post(PARKING_SERVICE.transaction.adminSearch + "?" + getParamsPage(page, size, null, null), data, {
  })
}

export async function partnerGetHistory(data, page, size) {
  return await httpClient.post(PARKING_SERVICE.transaction.partnerSearch + "?" + getParamsPage(page, size, null, null), data, {
  })
}
