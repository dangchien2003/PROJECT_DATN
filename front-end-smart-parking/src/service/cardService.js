import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage, getRequestParams, replaceParamsUrl } from '@/utils/api'


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

export async function activeCard(id, code) {
  return await httpClient.put(PARKING_SERVICE.card.active, {id, code}, {
  })
}

export async function lockCard(id, lock) {
  let url = replaceParamsUrl(PARKING_SERVICE.card.lock, {id}) + "?";
  url += getRequestParams({lock});
  return await httpClient.patch(url, {
  })
}

export async function permanentLock(id) {
  return await httpClient.patch(replaceParamsUrl(PARKING_SERVICE.card.permanentLock, {id}), {
  })
}

export async function linkTicket(cardId, ticketId) {
  return await httpClient.post(PARKING_SERVICE.card.linkTicket, {cardId, ticketId}, {
  })
}

export async function unlinkTicket(id) {
  return await httpClient.patch(replaceParamsUrl(PARKING_SERVICE.card.unlinkTicket, {id}), {}, {
  })
}

export async function madeCard(id) {
  return await httpClient.patch(replaceParamsUrl(PARKING_SERVICE.card.madeCard, {id}), {}, {
  })
}