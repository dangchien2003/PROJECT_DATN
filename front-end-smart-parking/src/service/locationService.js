import { PARKING_SERVICE } from "@/configs/apiConfig";
import httpClient from "@/configs/axiosConfig";
import { getParamsSorting } from "@/utils/api";

export async function modifyLocation(data) {
  return await httpClient.post(PARKING_SERVICE.location.modify, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function partnerSearch(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.location.partnerSearch + "?" + getParamsSorting(page, size, field, sort), data, {
    headers: {
      Authorization: undefined
    }
  })
}

