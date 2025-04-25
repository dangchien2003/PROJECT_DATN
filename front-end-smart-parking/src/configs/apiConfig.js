export const API_BASE_URL = 'http://localhost:8081/'

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
    approve: "location/approve",
    modifyDetail: "location/detail/modify",
    locationDetail: "location/detail",
    waitReleaseDetail: "location/detail/wait-release",
    getMapLocation: "location/list/coordinates",
    getAllRecordIsActive: "location/all/is-active",
  },
  ticket: {
    modify: "ticket/modify",
    partnerSearch: "ticket/partner/search",
  }
}
