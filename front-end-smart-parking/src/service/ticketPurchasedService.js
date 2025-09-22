import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage, replaceParamsUrl } from '@/utils/api'

export async function getTicketPurchased(data, page, size) {
  return await httpClient.post(PARKING_SERVICE.ticketPurchased.customerSearch + "?" + getParamsPage(page, size, null, null), data, {
  })
}

export async function getQrCode(id) {
  return await httpClient.get(PARKING_SERVICE.ticketPurchased.getQrCode + `?id=${id}`, {
  })
}

export async function refreshQr(id) {
  return await httpClient.patch(PARKING_SERVICE.ticketPurchased.refreshQr + `?id=${id}`, {
  })
}

export async function getDetail(id) {
  return await httpClient.get(PARKING_SERVICE.ticketPurchased.detail + `?id=${id}`, {
  })
}

export async function disableTicket(id) {
  return await httpClient.patch(PARKING_SERVICE.ticketPurchased.disableTicket + `?id=${id}`, {
  })
}

export async function enableTicket(id) {
  return await httpClient.patch(PARKING_SERVICE.ticketPurchased.enableTicket + `?id=${id}`, {
  })
}

export async function getHistoryInOut(id) {
  return await httpClient.get(replaceParamsUrl(PARKING_SERVICE.ticketPurchased.historyInOut, {id}), {
  })
}

export async function historyBuyTicket(dataSearch, page, size) {
  return await httpClient.post(PARKING_SERVICE.ticketPurchased.historyBuyTicket, dataSearch, {
    params: {page, size}
  })
}