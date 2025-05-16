import { API_BASE_URL_NOTIFY, NOTIFY_SERVICE } from "@/configs/apiConfig";
import httpClient from "@/configs/axiosConfig";
import { getRequestParams } from "@/utils/api";

export async function countNotify() {
  return await httpClient.get(NOTIFY_SERVICE.notify.countViewNotYet, {
    baseURL: API_BASE_URL_NOTIFY,
    headers: {
      Authorization: undefined
    }
  })
}


export async function getAllNotify(page) {
  return await httpClient.get(NOTIFY_SERVICE.notify.getAllNotify + "?" + getRequestParams({page}), {
    baseURL: API_BASE_URL_NOTIFY,
    headers: {
      Authorization: undefined
    }
  })
}


export async function viewedAll() {
  return await httpClient.put(NOTIFY_SERVICE.notify.viewedAll,{} ,{
    baseURL: API_BASE_URL_NOTIFY,
    headers: {
      Authorization: undefined
    }
  })
}

