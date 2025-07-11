import { PARKING_SERVICE } from "@/configs/apiConfig";
import httpClient from "@/configs/axiosConfig";
import { getParamsPage, getRequestParams } from "@/utils/api";

export async function modifyLocation(data) {
  return await httpClient.post(PARKING_SERVICE.location.modify, data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function partnerSearch(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.location.partnerSearch + "?" + getParamsPage(page, size, field, sort), data, {
    headers: {
      Authorization: undefined
    }
  })
}


export async function adminSearchWaitApprove(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.location.adminSearchWaitApprove + "?" + getParamsPage(page, size, field, sort), data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function adminSearch(data, page, size, field, sort) {
  return await httpClient.post(PARKING_SERVICE.location.adminSearch + "?" + getParamsPage(page, size, field, sort), data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function customerSearch(data, page, size) {
  return await httpClient.post(PARKING_SERVICE.location.customerSearch + "?" + getParamsPage(page, size, null, null), data, {
    headers: {
      Authorization: undefined
    }
  })
}

export async function approve(action) {
  return await httpClient.post(PARKING_SERVICE.location.approve, action, {
    headers: {
      Authorization: undefined
    }
  })
}


export async function modifyDetail(id) {
  return await httpClient.get(PARKING_SERVICE.location.modifyDetail + "?" + getRequestParams({ id }), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function locationDetail(id) {
  return await httpClient.get(PARKING_SERVICE.location.customerDetail + "?" + getRequestParams({ id }), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function customerDetail(id) {
  return await httpClient.get(PARKING_SERVICE.location.customerDetail + "?" + getRequestParams({ id }), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function waitReleaseDetail(id) {
  return await httpClient.get(PARKING_SERVICE.location.waitReleaseDetail + "?" + getRequestParams({ id }), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function getMapLocation(page) {
  return await httpClient.get(PARKING_SERVICE.location.getMapLocation + "?" + getRequestParams({ page }), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function getAllRecordIsActive(page) {
  return await httpClient.get(PARKING_SERVICE.location.getAllRecordIsActive + "?" + getRequestParams({ page }), {
    headers: {
      Authorization: undefined
    }
  })
}

export async function getListDetail(ids) {
  return await httpClient.post(PARKING_SERVICE.location.listDetail, ids, {
    headers: {
      Authorization: undefined
    }
  })
}