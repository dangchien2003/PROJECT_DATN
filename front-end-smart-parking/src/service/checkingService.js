import { PARKING_SERVICE } from '@/configs/apiConfig'
import httpClient from '@/configs/axiosConfig'

export async function detailChecking(id) {
  return await httpClient.get(PARKING_SERVICE.checking.detail, { params: { id } })
}

export async function historyCheckingByLocation(locationId, page, size) {
  return await httpClient.get(PARKING_SERVICE.checking.historyByLocation, {params: {
    locationId, page, size
  }})
}