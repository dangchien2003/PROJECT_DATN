import Map from '@/components/Map'
import { getAllLocationOfPartner } from '@/service/statisticalService';
import { getDataApi } from '@/utils/api';
import { convertDataMap } from '@/utils/data';
import { toastError } from '@/utils/toast';
import React, { useEffect, useState } from 'react'

const MapAllLoaction = ({ info }) => {
  const [dataMap, setDataMap] = useState([]);

  useEffect(() => {
    getAllLocationOfPartner(info.id).then((response) => {
      const result = getDataApi(response);
      // convert data thành dữ liệu bản đồ
      const newData = convertDataMap(result);
      // nối thêm data
      setDataMap(newData);
    })
      .catch((error) => {
        const dataError = getDataApi(error);
        toastError(dataError?.message)
      })
      .finally(() => {
      })
  }, [info.id])
  return (
    <Map data={dataMap} style={{ height: 500 }} />
  )
}

export default MapAllLoaction
