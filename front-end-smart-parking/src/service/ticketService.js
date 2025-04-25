import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage } from '@/utils/api'

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