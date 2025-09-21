import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage, getRequestParams, replaceParamsUrl } from '@/utils/api'

export async function createAccountByAdmin(data) {
  return await httpClient.post(PARKING_SERVICE.account.createByAdmin, data, {
  })
}

export async function searchAccountCustomer(dataSearch, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.account.searchListCustomer + "?" + getParamsPage(page, size, field, sort), dataSearch, {
  })
}

export async function searchPartner(dataSearch, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.account.searchListPartner + "?" + getParamsPage(page, size, field, sort), dataSearch, {
  })
}

export async function detailCustomer(params) {
  return await httpClient.get(replaceParamsUrl(PARKING_SERVICE.account.detailCustomer + "?" + getRequestParams(params), params), {
  })
}

export async function detailPartner(params) {
  return await httpClient.get(replaceParamsUrl(PARKING_SERVICE.account.detailPartner + "?" + getRequestParams(params), params), {
  })
}

export async function getSuggestions(page, size, key) {
  return await httpClient.get(PARKING_SERVICE.account.getSuggestions + "?" + getRequestParams({key, page, size}), {
  })
}

export async function getBalance() {
  return await httpClient.get(PARKING_SERVICE.account.getBalance , {})
}

export async function getInfoAccount() {
  return await httpClient.get(PARKING_SERVICE.account.infoAccount , {})
}

export async function changeStatusAccount(accountId, status, reason) {
  return await httpClient.patch(PARKING_SERVICE.account.changeStatus , {accountId, status, reason}, {})
}

export async function changeInfo(key, newInfo) {
  return await httpClient.patch(PARKING_SERVICE.account.changeInfo , {key, newInfo}, {})
}

export async function changePassword(oldPassword, newPassword) {
  return await httpClient.patch(PARKING_SERVICE.account.changePassword , {oldPassword, newPassword}, {})
}

export async function changeInfoPartner(data) {
  return await httpClient.post(PARKING_SERVICE.account.    changeInfoPartner, data, {})
}