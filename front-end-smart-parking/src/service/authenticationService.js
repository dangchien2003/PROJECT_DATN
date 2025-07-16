import { PARKING_SERVICE } from "@/configs/apiConfig";
import httpClient from "@/configs/axiosConfig";

export async function login(data) {
  return await httpClient.post(PARKING_SERVICE.authen.login, data, {
    skipAuth: true
  })
}


export async function checkAccessToken(data) {
  return await httpClient.post(PARKING_SERVICE.authen.checkAccess, data, {
    skipAuth: true
  })
}

export async function registrationAccount(data) {
  return await httpClient.post(PARKING_SERVICE.authen.registration, data, {
    skipAuth: true
  })
}

export async function forgetAccount(username) {
  return await httpClient.post(PARKING_SERVICE.authen.forget, {username}, {
    skipAuth: true
  })
}

export async function confirmForget(data) {
  return await httpClient.post(PARKING_SERVICE.authen.confirmForget, data, {
    skipAuth: true
  })
}




