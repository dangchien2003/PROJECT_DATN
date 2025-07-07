import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage } from '@/utils/api'


export async function customerGetHistory(data, page, size) {
  return await httpClient.post(PARKING_SERVICE.transaction.customerSearch + "?" + getParamsPage(page, size, null, null), data, {
    headers: {
      Authorization: undefined
    }
  })
}