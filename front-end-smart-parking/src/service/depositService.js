import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsPage, replaceParamsUrl } from '@/utils/api'


export async function requestDeposit(payload) {
  return await httpClient.post(PARKING_SERVICE.deposit.requestDeposit, payload, {
    headers: {
      Authorization: undefined
    }
  })
}



export async function getHistory(page, size) {
  return await httpClient.get(PARKING_SERVICE.deposit.getHistory + "?" + getParamsPage(page, size, null, null), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function cancelRequest(id) {
  return await httpClient.delete(replaceParamsUrl(PARKING_SERVICE.deposit.cancelRequest, {id}), {
    headers: {
      Authorization: undefined
    }
  })
}
