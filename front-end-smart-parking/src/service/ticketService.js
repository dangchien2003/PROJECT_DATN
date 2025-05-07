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

export async function adminSearch(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.ticket.adminSearch + "?" + getParamsPage(page, size, field, sort), data, {
    headers: {
      Authorization: undefined
    }
  })
}