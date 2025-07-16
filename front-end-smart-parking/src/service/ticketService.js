import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage, getRequestParams } from '@/utils/api'

export async function modifyTicket(data) {
  return await httpClient.post(PARKING_SERVICE.ticket.modify, data, {
  })
}

export async function partnerSearch(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.ticket.partnerSearch + "?" + getParamsPage(page, size, field, sort), data, {
  })
}

export async function customerSearch(data, page, size) {
  return await httpClient.post(PARKING_SERVICE.ticket.customerSearch + "?" + getParamsPage(page, size), data, {
    skipAuth: true
  })
}

export async function detail(id) {
  return await httpClient.get(PARKING_SERVICE.ticket.detail + "?" + getRequestParams({id}), {
  })
}

export async function customerTicketDetail(id) {
  return await httpClient.get(PARKING_SERVICE.ticket.customerTicketDetail + "?" + getRequestParams({id}), {
    skipAuth: true
  })
}

export async function customerGetLocationUseTicket(page, size, id) {
  const data = {
    page, 
    size,
    id 
  }
  return await httpClient.get(PARKING_SERVICE.ticket.customerLocationUseTicket + "?" + getRequestParams(data), {
    skipAuth: true
  })
}

export async function detailWaitRelease(id) {
  return await httpClient.get(PARKING_SERVICE.ticket.detailWaitRelease + "?" + getRequestParams({id}), {
  })
}

export async function partnerCancelRelease(data) {
  return await httpClient.post(PARKING_SERVICE.ticket.partnerCancelRelease, data, {
  })
}

export async function adminCancelRelease(data) {
  return await httpClient.post(PARKING_SERVICE.ticket.adminCancelRelease, data, {
  })
}

export async function adminSearch(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.ticket.adminSearch + "?" + getParamsPage(page, size, field, sort), data, {
  })
}

export async function checkExistWaitRelease(ticketId) {
  return await httpClient.get(PARKING_SERVICE.ticket.checkExistWaitRelease + `?ticketId=${ticketId}`, {
  })
}
