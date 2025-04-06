export const getParamsSorting = (page, size, field, sort) => {
  let params = `page=${page}&size=${size}`;
  if(field && sort) {
      params += `&sort=${field},${sort}`;
  }
  return params;
}

export const convertDataSort = (sort) => {
  if(sort.order) {
    sort.order = sort.order === "ascend" ? "ASC" : "DESC";
  }
}