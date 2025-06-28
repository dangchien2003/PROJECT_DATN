export const API_BASE_URL = 'http://localhost:8081/'
export const API_BASE_URL_NOTIFY = 'http://localhost:8083/'

export const PARKING_SERVICE = {
  account: {
    createByAdmin: "account/create-by-admin",
    searchListCustomer: "account/search/customer",
    searchListPartner: "account/search/partner",
    detailCustomer: "account/customer/detail",
    detailPartner: "account/partner/detail",
  },
  location: {
    modify: "location/modify",
    partnerSearch: "location/partner/search",
    adminSearchWaitApprove: "location/admin/search/wait-approve",
    adminSearch: "location/admin/search",
    customerSearch: "location/customer/search",
    approve: "location/approve",
    modifyDetail: "location/detail/modify",
    locationDetail: "location/detail",
    customerDetail: "location/customer/detail",
    waitReleaseDetail: "location/detail/wait-release",
    getMapLocation: "location/list/coordinates",
    getAllRecordIsActive: "location/all/is-active",
    listDetail: "location/list/detail",
  },
  ticket: {
    modify: "ticket/modify",
    partnerSearch: "ticket/partner/search",
    adminSearch: "ticket/admin/search",
    customerSearch: "ticket/search",
    detail: "ticket/detail",
    customerTicketDetail: "ticket/customer/detail",
    customerLocationUseTicket: "ticket/customer/location-use-ticket",
    detailWaitRelease: "ticket/detail/wait-release",
    partnerCancelRelease: "ticket/partner/cancel/wait-release",
    adminCancelRelease: "ticket/admin/cancel/wait-release",
    checkExistWaitRelease: "ticket/check-exist-wait-release",
  },
  authen: {
    login: "auth/sign-in",
    checkAccess: "auth/check-token", 
    registration: "auth/registration",
    forget: "auth/forget",
    confirmForget: "auth/forget/confirm",
  },
  card: {
    customerAdditional: "card/request/additional",
    customerCardApprove: "card/approved",
    customerHistoryRequest: "card/history/request",
  }
}

export const NOTIFY_SERVICE = {
  notify: {
    countViewNotYet: "notify/count/viewed-not-yet",
    getAllNotify: "notify/get/all",
    viewedAll: "notify/view/all"
  }
}