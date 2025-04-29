import { useLoading } from '@/hook/loading';
import { getAllRecordIsActive } from '@/service/locationService';
import { getDataApi } from '@/utils/api';
import { toastError } from '@/utils/toast';
import { Transfer } from 'antd';
import { useEffect, useState } from 'react'

const convertData = (data) => {
  return data.map((item) => {
    return {
      key: item?.locationId,
      title: item?.name
    }
  })
}
const SelectLocation = ({ data }) => {
  const [page, setPage] = useState(0);
  const [dataKeys, setDataKeys] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const { hideLoad, showLoad } = useLoading();
  const loadData = () => {
    let result = null;
    getAllRecordIsActive(page)
      .then(response => {
        result = getDataApi(response);
        // convert data thành dữ liệu bản đồ
        const newData = convertData(result);
        // nối thêm data
        setDataKeys(pre => pre.concat(newData));
      }).catch(error => {
        const dataError = getDataApi(error);
        toastError(dataError?.message)
      })
      .finally(() => {
        hideLoad();
        if (result) {
          if (result.getTotalPage > page + 1) {
            setPage(page + 1);
          }
        }
      })
  }
  useEffect(() => {
    let timeOutId = null;
    if (page === 0) {
      showLoad("Đang tải dữ liệu");
      loadData();
    } else {
      // delay
      timeOutId = setTimeout(() => {
        loadData();
      }, 1000);
    }
    return () => {
      clearTimeout(timeOutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onChange = (keys) => {
    setTargetKeys(keys);
    data.locationUse = keys
  };
  useEffect(() => {
    setTargetKeys(data?.locationUse ? data.locationUse : [])
  }, [data])
  return (
    <div>
      <Transfer
        showSearch
        dataSource={dataKeys}
        targetKeys={targetKeys}
        onChange={onChange}
        render={item => item.title}
        titles={[
          "Địa điểm đang hoạt động",
          "Địa điểm được áp dụng",
        ]}
        locale={{
          itemUnit: 'địa điểm',
          itemsUnit: 'địa điểm',
          notFoundContent: 'Không có dữ liệu',
        }}
      />
    </div>
  )
}

export default SelectLocation
