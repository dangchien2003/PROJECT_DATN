import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'
import { getParamsSorting, getRequestParams, replaceParamsUrl } from '@/utils/api'

export async function modifyTicket(data) {
  return await httpClient.post(PARKING_SERVICE.ticket.modify, data, {
    headers: {
      Authorization: undefined
    }
  })
}