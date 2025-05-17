import { KEY } from "@/utils/constants";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookie";
import { isNullOrUndefined } from "@/utils/data";

export function setAccessToken(token, secondsExprire) {
  if (isNullOrUndefined(token) || token === "") {
    return;
  }
  setCookie(KEY.accessToken, token, secondsExprire);
}

export function getAccessToken() {
  return getCookie(KEY.accessToken);
}

export function moveAccessToken() {
  deleteCookie(KEY.accessToken);
}

export function setRememberUser(username) {
  if (isNullOrUndefined(username) || username === "") {
    return;
  }
  setCookie(KEY.rememberUser, username, 100000000000000);
}

export function getRememberUser() {
  return getCookie(KEY.rememberUser);
}

export function cancelRememberUser() {
  deleteCookie(KEY.rememberUser);
}

