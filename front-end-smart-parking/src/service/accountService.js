import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsSorting } from '@/utils/api'

export async function createAccountByAdmin(data) {
  return await httpClient.post(PARKING_SERVICE.account.createByAdmin, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function searchAccountCustomer(dataSearch, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.account.searchListCustomer + "?" + getParamsSorting(page, size, field, sort), dataSearch, {
    headers: {
      Authorization: undefined
    }
  })
}