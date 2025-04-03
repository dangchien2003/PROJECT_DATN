import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'

export async function createAccountByAdmin(data) {
  return await httpClient.post(PARKING_SERVICE.account.createByAdmin, data, {
    headers: {
      Authorization: undefined
    }
  })
}