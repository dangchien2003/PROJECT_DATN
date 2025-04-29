export const getParamsPage = (page, size, field, sort) => {
  let params = `page=${page}&size=${size}`;
  if (field && sort) {
    params += `&sort=${field},${sort}`;
  }
  return params;
}

export const getRequestParams = (params) => {
  let newUrl = "";
  Object.keys(params).forEach((key) => {
    newUrl += `${key}=${params[key]}&`;
  });
  return newUrl.slice(0, -1);
}

export const replaceParamsUrl = (url, params) => {
  let newUrl = url;
  Object.keys(params).forEach((key) => {
    newUrl = newUrl.replace(`:${key}`, params[key]);
  });
  return newUrl;
}

export const convertDataSort = (sort, dataMapFieldName = {}) => {
  if (sort.order) {
    sort.order = sort.order === "ascend" ? "ASC" : "DESC";
  }
  Object.keys(dataMapFieldName).forEach((key) => {
    if (sort.field === key) {
      sort.field = dataMapFieldName[key];
    }
  })
}

export const getDataApi = (response) => {
  if (response.data?.result?.data) {
    return response.data.result.data;
  }
  if (response.data) {
    if (response.data.result) {
      return response.data.result;
    }
    return response.data;
  }
  if (response.response) {
    return response.response.data;
  }
  return response
}