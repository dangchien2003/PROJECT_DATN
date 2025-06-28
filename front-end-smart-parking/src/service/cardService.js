import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage } from '@/utils/api'


export async function requestAddCard(reason) {
  return await httpClient.post(PARKING_SERVICE.card.customerAdditional, {reason}, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function getCardApproved(page, size) {
  return await httpClient.get(PARKING_SERVICE.card.customerCardApprove + "?" + getParamsPage(page, size, null, null), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function getHistoryRequest(page, size) {
  return await httpClient.get(PARKING_SERVICE.card.customerHistoryRequest + "?" + getParamsPage(page, size, null, null), {
    headers: {
      Authorization: undefined
    }
  })
}