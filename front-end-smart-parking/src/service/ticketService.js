import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage, getRequestParams } from '@/utils/api'

export async function modifyTicket(data) {
  return await httpClient.post(PARKING_SERVICE.ticket.modify, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function partnerSearch(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.ticket.partnerSearch + "?" + getParamsPage(page, size, field, sort), data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function customerSearch(data, page, size) {
  return await httpClient.post(PARKING_SERVICE.ticket.customerSearch + "?" + getParamsPage(page, size), data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function detail(id) {
  return await httpClient.get(PARKING_SERVICE.ticket.detail + "?" + getRequestParams({id}), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function detailWaitRelease(id) {
  return await httpClient.get(PARKING_SERVICE.ticket.detailWaitRelease + "?" + getRequestParams({id}), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function partnerCancelRelease(data) {
  return await httpClient.post(PARKING_SERVICE.ticket.partnerCancelRelease, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function adminCancelRelease(data) {
  return await httpClient.post(PARKING_SERVICE.ticket.adminCancelRelease, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function adminSearch(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.ticket.adminSearch + "?" + getParamsPage(page, size, field, sort), data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function checkExistWaitRelease(ticketId) {
  return await httpClient.get(PARKING_SERVICE.ticket.checkExistWaitRelease + `?ticketId=${ticketId}`, {
    headers: {
      Authorization: undefined
    }
  })
}
