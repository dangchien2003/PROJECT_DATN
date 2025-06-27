import { showTotal } from '@/utils/table';
import { Table } from 'antd';
import dayjs from "dayjs";
import { useEffect, useState } from 'react';
import { ImCancelCircle } from "react-icons/im";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { IoTimer } from 'react-icons/io5';
import { MdCreditCardOff } from 'react-icons/md';
import { dataCardFake } from './fakeData';
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
    dataIndex: "reason",
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
    pageSize: 10,
    total: 0,
  });
  const [sorter] = useState({
    field: null,
    order: null,
  });

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.timesPrint = "Lần " + item.times;
      item.statusPrint = "";
      if (item.status === 0) {
        item.statusPrint = <div><IoTimer /> Chờ duyệt</div>
      } else if (item.status === 1) {
        item.statusPrint = <div><MdCreditCardOff /> Chờ cấp thẻ</div>
      } else if (item.status === 6) {
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

  useEffect(() => {
    setData(convertResponseToDataTable(dataCardFake, pagination.current, pagination.pageSize));
  }, [])

  const handleTableChange = (newPagination, _, sorter) => {
    // convertDataSort(sorter, mapFieldSort)
    // loadData(newPagination, sorter);
  };

  return (
    <div className='history-request-additional-card'>
      <h2 className='page-name'>Yêu cầu của bạn</h2>
      <Table
        columns={baseColumns}
        dataSource={data}
        rowKey="id"
        // loading={loading}
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