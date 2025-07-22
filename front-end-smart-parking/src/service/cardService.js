import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage, replaceParamsUrl } from '@/utils/api'


export async function requestAddCard(reason) {
  return await httpClient.post(PARKING_SERVICE.card.customerAdditional, {reason}, {
  })
}

export async function getCardApproved(page, size) {
  return await httpClient.get(PARKING_SERVICE.card.customerCardApprove + "?" + getParamsPage(page, size, null, null), {
  })
}

export async function getHistoryRequest(page, size) {
  return await httpClient.get(PARKING_SERVICE.card.customerHistoryRequest + "?" + getParamsPage(page, size, null, null), {
  })
}

export async function adminSearch(dataSearch, page, size, field, order) {
  return await httpClient.post(PARKING_SERVICE.card.adminSearch + "?" + getParamsPage(page, size, field, order), dataSearch, {
  })
}

export async function adminSearchRequestAdd(dataSearch, page, size, field, order) {
  return await httpClient.post(PARKING_SERVICE.card.adminSearchRequestAdd + "?" + getParamsPage(page, size, field, order), dataSearch, {
  })
}

export async function rejectRequest(id, reason) {
  return await httpClient.patch(PARKING_SERVICE.card.rejectRequest, {id, reason}, {
  })
}

export async function approveRequest(id) {
  return await httpClient.patch(replaceParamsUrl(PARKING_SERVICE.card.approveRequest, {id}), null, {
  })
}