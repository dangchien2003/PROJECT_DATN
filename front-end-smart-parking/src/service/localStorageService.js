import { KEY } from "@/utils/constants";
import { isNullOrUndefined } from "@/utils/data";

export function setRefreshToken(token) {
  if (isNullOrUndefined(token) || token === "") {
    return;
  }
  return localStorage.setItem(KEY.refreshToken, token);
}


export function getRefeshToken() {
  return localStorage.getItem(KEY.refreshToken);
}

export function deleteRefeshToken() {
  return localStorage.removeItem(KEY.refreshToken);
}

export function setCodeVerifierToLocalStorage(value) {
  if (isNullOrUndefined(value) || value === "") {
    return;
  }
  return localStorage.setItem(KEY.googleCodeVerifier, value);
}

export function getCodeVerifierToLocalStorage() {
  return localStorage.getItem(KEY.googleCodeVerifier);
}

export function setAccountFullName(name) {
  if (isNullOrUndefined(name) || name === "") {
    return;
  }
  return localStorage.setItem(KEY.accountFullname, name);
}

export function getAccountFullName() {
  return localStorage.getItem(KEY.accountFullname);
}

export function setPartnerFullName(name) {
  if (isNullOrUndefined(name) || name === "") {
    return;
  }
  return localStorage.setItem(KEY.partnerFullname, name);
}

export function getPartnerFullName() {
  return localStorage.getItem(KEY.partnerFullname);
}

export function setAccountId(id) {
  return localStorage.setItem(KEY.accountId, id);
}

export function getAccountId() {
  return localStorage.getItem(KEY.accountId);
}

export function setActor(actor) {
  return localStorage.setItem(KEY.actor, actor);
}

export function getActor() {
  return localStorage.getItem(KEY.actor);
}
