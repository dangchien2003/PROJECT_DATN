export function isNullOrUndefined(data) {
  return data === null || data === undefined;
}

export const convertDataMap = (data) => {
  if (!data) {
    return [];
  }
  // lọc các dữ liệu null hoặc không có địa điểm
  const dataMap = data.filter(item => (!isNullOrUndefined(item) && !isNullOrUndefined(item?.coordinatesX) && !isNullOrUndefined(item?.coordinatesY)));

  if(dataMap.length === 0) {
    return [];
  }
  // convert
  return dataMap.map((item) => {
    return {
      ...item, 
      position: [item.coordinatesX, item.coordinatesY],
      popupContent: (
        <a
          href={item.linkGoogleMap}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "black", textDecoration: "none" }}
        >
          {item.name}
        </a>
      ),
    }
  })
}