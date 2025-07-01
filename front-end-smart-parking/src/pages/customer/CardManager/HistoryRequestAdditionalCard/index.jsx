import { getHistoryRequest } from '@/service/cardService';
import { getDataApi } from '@/utils/api';
import { CARD_STATUS_2 } from '@/utils/constants';
import { showTotal } from '@/utils/table';
import { toastError } from '@/utils/toast';
import { Table } from 'antd';
import dayjs from "dayjs";
import { useEffect, useState } from 'react';
import { ImCancelCircle } from "react-icons/im";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { IoTimer } from 'react-icons/io5';
import { MdCreditCardOff } from 'react-icons/md';
import './style.css';

const baseColumns = [
  {
    title: "Lần yêu cầu",
    dataIndex: "timesPrint",
    key: "1",
    width: 150,
    align: "left"
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "2",
    width: 170,
    align: "left"
  },
  {
    title: "Ngày yêu cầu",
    dataIndex: "createdTime",
    key: "3",
    width: 150,
    align: "center"
  },
  {
    title: "Lý do",
    dataIndex: "reasonRequest",
    key: "4",
    width: 250,
    align: "left",
    scroll: true
  }
];
const HistoryRequestAdditionalCard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const convertResponseToDataTable = (data) => {
    return data.map((item) => {
      item.timesPrint = "Lần " + item.issuedTimes;
      item.statusPrint = "";
      if (item.status === CARD_STATUS_2.CHO_DUYET.value) {
        item.statusPrint = <div><IoTimer /> Chờ duyệt</div>
      } else if (item.status === CARD_STATUS_2.CHO_CAP.value) {
        item.statusPrint = <div><MdCreditCardOff /> Chờ cấp thẻ</div>
      } else if (item.status === CARD_STATUS_2.TU_CHOI.value) {
        item.statusPrint = <div className='cancel'>
          <div><ImCancelCircle /> Từ chối</div>
          <div className='reason'>{item.reasonReject}</div>
        </div>
      } else {
        item.statusPrint = <div className='success'>
          <IoMdCheckmarkCircleOutline /> Hoàn thành
        </div>
      }
      item.createdTime = dayjs(item.createdAt).format("DD/MM/YYYY")
      return item;
    })
  }

  const loadData = (newPagination) => {
    setLoading(true);
    setData([])
    getHistoryRequest(newPagination.current - 1, newPagination.pageSize)
      .then((response) => {
        const data = getDataApi(response);
        setData(convertResponseToDataTable(data.data));
        setPagination({
          ...newPagination,
          total: data.totalElements
        });
      })
      .catch((error) => {
        error = getDataApi(error);
        toastError(error.message)
      })
      .finally(() => {
        setLoading(false);
      });
  };
  console.log(pagination)
  useEffect(() => {
    loadData(pagination);
  }, [])

  const handleTableChange = (newPagination, _, sorter) => {
    loadData(newPagination);
  };

  return (
    <div className='history-request-additional-card'>
      <h2 className='page-name'>Yêu cầu của bạn</h2>
      <Table
        columns={baseColumns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{
          x: "max-content",
        }}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: showTotal
        }}
      />
    </div>
  );
};

export default HistoryRequestAdditionalCard;