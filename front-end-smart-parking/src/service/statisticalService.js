import { PARKING_SERVICE } from "@/configs/apiConfig";
import httpClient from "@/configs/axiosConfig";

export async function getTicketOfCustomer(accountId, page, size) {
  return await httpClient.get(PARKING_SERVICE.statistical.getTicketOfCustomer, {
    params: {accountId, page, size}
  })
}

export async function getTransactionOfCustomer(accountId, page, size) {
  return await httpClient.get(PARKING_SERVICE.statistical.getTransactionOfCustomer, {
    params: {accountId, page, size}
  })
}

export async function getTicketOfPartner(partnerId, page, size) {
  return await httpClient.get(PARKING_SERVICE.statistical.getTicketOfPartner, {
    params: {partnerId, page, size}
  })
}

export async function StatisticalTicketWaitReleaseOfPartner(partnerId, page, size) {
  return await httpClient.get(PARKING_SERVICE.statistical.StatisticalTicketWaitReleaseOfPartner, {
    params: {partnerId, page, size}
  })
}

export async function getAllLocationOfPartner(partnerId) {
  return await httpClient.get(PARKING_SERVICE.statistical.getAllLocationOfPartner, {
    params: {partnerId}
  })
}

export async function getListTicketPurchaseOfPartner(partnerId, page, size) {
  return await httpClient.get(PARKING_SERVICE.statistical.getListTicketPurchaseOfPartner, {
    params: {partnerId, page, size}
  })
}

export async function getLocationOfPartner(partnerId, page, size) {
  return await httpClient.get(PARKING_SERVICE.statistical.getLocationOfPartner, {
    params: {partnerId, page, size}
  })
}

export async function getLocationWaitReleaseOfPartner(partnerId, page, size) {
  return await httpClient.get(PARKING_SERVICE.statistical.getLocationWaitReleaseOfPartner, {
    params: {partnerId, page, size}
  })
}

export async function getLocationWaitApproveOfPartner(partnerId, page, size) {
  return await httpClient.get(PARKING_SERVICE.statistical.getLocationWaitApproveOfPartner, {
    params: {partnerId, page, size}
  })
}


export async function getStatisticalCardAtHomeByAdmin() {
  return await httpClient.get(PARKING_SERVICE.statistical.getStatisticalCardAtHomeByAdmin, {})
}

export async function getStatisticalPieAtHomeByAdmin() {
  return await httpClient.get(PARKING_SERVICE.statistical.getStatisticalPieAtHomeByAdmin, {})
}


export async function getStatisticalAreaAtHomeByAdmin() {
  return await httpClient.get(PARKING_SERVICE.statistical.getStatisticalAreaAtHomeByAdmin, {})
}


