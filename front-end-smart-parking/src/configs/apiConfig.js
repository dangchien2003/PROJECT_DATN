export const API_BASE_URL = 'http://localhost:8081/'
export const API_BASE_URL_NOTIFY = 'http://localhost:8083/'

export const PARKING_SERVICE = {
  account: {
    createByAdmin: "account/create-by-admin",
    searchListCustomer: "account/search/customer",
    searchListPartner: "account/search/partner",
    detailCustomer: "account/customer/detail",
    detailPartner: "account/partner/detail",
    getSuggestions: "account/suggestions",
    getBalance: "account/balance",
    infoAccount: "account/info",
    changeStatus: "account/change-status",
    changeInfo: "account/change-info",
    changePassword: "account/change-password",
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
    statisticsOfUsedPositions: "location/statistics-of-used-positions",
    getSuggestions: "location/suggestions",
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
  ticketPurchased: {
    customerSearch: "purchased/customer/search",
    getQrCode: "purchased/get-qr",
    refreshQr: "purchased/new-qr",
    detail: "purchased/detail",
    enableTicket: "purchased/enable",
    disableTicket: "purchased/disable",
    historyInOut: "purchased/history/:id",
  },
  authen: {
    login: "auth/sign-in",
    checkAccess: "auth/check-token", 
    refreshToken: "auth/refresh", 
    registration: "auth/registration",
    confirmRegis: "auth/confirm-regis",
    forget: "auth/forget",
    confirmForget: "auth/forget/confirm",
  },
  card: {
    customerAdditional: "card/request/additional",
    customerCardApprove: "card/approved",
    customerHistoryRequest: "card/history/request",
    customerHistoryRequestOfCustomer: "card/history/request-of",
    adminSearch: "card/admin/search",
    adminSearchRequestAdd: "card/admin/search/add",
    rejectRequest: "card/reject-request",
    approveRequest: "card/approve-request/:id",
    active: "card/active",
    lock: "card/lock/:id",
    permanentLock: "card/permanent-lock/:id",
    linkTicket: "card/link-ticket",
    unlinkTicket: "card/cancel-link-ticket/:id",
    madeCard: "card/made-card/:id",
    detailCardByadmin: "card/admin/detail"
  },
  order: {
    createOrder: "order",
    confirmOrder: "order/confirm",
  },
  transaction: {
    customerSearch: "transaction/history"
  },
  deposit: {
    requestDeposit: "deposit",
    getHistory: "deposit/history",
    cancelRequest: "deposit/cancel/:id",
  },
  statistical: {
    getTicketOfCustomer: "statistical/ticket-of-customer",
    getTransactionOfCustomer: "statistical/transaction-of-customer",
    getTicketOfPartner: "statistical/ticket-of-partner",
    StatisticalTicketWaitReleaseOfPartner: "statistical/ticket-wait-approve-of-partner",
    getAllLocationOfPartner: "location/list/coordinates-of-partner",
    getListTicketPurchaseOfPartner: "statistical/ticket-purchased-of-partner",
    getLocationOfPartner: "statistical/location-of-partner",
    getLocationWaitReleaseOfPartner: "statistical/location-wait-release-of-partner",
    getLocationWaitApproveOfPartner: "statistical/location-wait-approve-of-partner",
    getStatisticalCardAtHomeByAdmin: "statistical/card-at-home-admin",
    getStatisticalPieAtHomeByAdmin: "statistical/pie-at-home-admin",
    getStatisticalAreaAtHomeByAdmin: "statistical/area-at-home-admin",
  }
}

export const NOTIFY_SERVICE = {
  notify: {
    countViewNotYet: "notify/count/viewed-not-yet",
    getAllNotify: "notify/get/all",
    viewedAll: "notify/view/all"
  }
}