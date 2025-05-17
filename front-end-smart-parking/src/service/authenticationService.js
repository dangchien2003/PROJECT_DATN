import { PARKING_SERVICE } from "@/configs/apiConfig";
import httpClient from "@/configs/axiosConfig";

export async function login(data) {
  return await httpClient.post(PARKING_SERVICE.authen.login, data, {
    headers: {
      Authorization: undefined
    }
  })
}


export async function checkAccessToken(data) {
  return await httpClient.post(PARKING_SERVICE.authen.checkAccess, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function registrationAccount(data) {
  return await httpClient.post(PARKING_SERVICE.authen.registration, data, {
    headers: {
      Authorization: undefined
    }
  })
}


