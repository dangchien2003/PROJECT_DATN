import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage, getRequestParams, replaceParamsUrl } from '@/utils/api'

export async function createAccountByAdmin(data) {
  return await httpClient.post(PARKING_SERVICE.account.createByAdmin, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function searchAccountCustomer(dataSearch, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.account.searchListCustomer + "?" + getParamsPage(page, size, field, sort), dataSearch, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function searchPartner(dataSearch, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.account.searchListPartner + "?" + getParamsPage(page, size, field, sort), dataSearch, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function detailCustomer(params) {
  return await httpClient.get(replaceParamsUrl(PARKING_SERVICE.account.detailCustomer + "?" + getRequestParams(params), params), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function detailPartner(params) {
  return await httpClient.get(replaceParamsUrl(PARKING_SERVICE.account.detailPartner + "?" + getRequestParams(params), params), {
    headers: {
      Authorization: undefined
    }
  })
}