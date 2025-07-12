import LineLoading from '@/components/Loading/LineLoading';
import ModalCustom from '@/components/ModalCustom';
import { getHistoryInOut } from '@/service/ticketPurchasedService';
import { getDataApi } from '@/utils/api';
import { showTotal } from '@/utils/table';
import { Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import DetailHistory from './DetailHistory';
import './style.css';
import { toastError } from '@/utils/toast';

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 60,
  },
  {
    title: "Giờ vào",
    dataIndex: "checkinAtPrint",
    key: "1",
    width: 120,
    align: "center"
  },
  {
    title: "Giờ ra",
    dataIndex: "checkoutAtPrint",
    key: "2",
    width: 120,
    align: "center"
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "3",
    width: 130,
    align: "left"
  },
  {
    title: "Xem",
    dataIndex: "view",
    key: "3",
    width: 70,
    align: "center",
    fixed: "right",
  }
];

const History = ({ id }) => {
  const [viewDetailId, setViewDetailId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleViewDetail = (id) => {
    setViewDetailId(id)
  }

  const handleCloseViewDetail = () => {
    setViewDetailId(null)
  }

  const convertResponseToDataTable = (data = [], currentPage, pageSize) => {
    return data.map((item, index) => ({
      ...item,
      checkinAtPrint: dayjs(item.checkinAt).format("HH:mm DD/MM/YYYY"),
      checkoutAtPrint: item.checkoutAt ? dayjs(item.checkoutAt).format("HH:mm DD/MM/YYYY") : null,
      statusPrint: item.status === 1 ? <div className='status'>
        <GoDotFill style={{ color: 'yellow' }} /> Đang gửi
      </div> : <div className='status'>
        <GoDotFill style={{ color: 'green' }} /> Hoàn thành
      </div>,
      view: <FaEye className='pointer' onClick={() => { handleViewDetail(item.id) }} />,
      stt: (currentPage - 1) * pageSize + index + 1
    }));
  }

  const loadData = (newPagination) => {
    getHistoryInOut(id).then(response => {
      const result = getDataApi(response);
      result.data = [{checkinAt: "2025-11-11T11:11:11", checkoutAt: "2025-11-11T11:15:15", status: 1, id: 1}]
      setData(convertResponseToDataTable(result.data, newPagination.current,
        newPagination.pageSize));
      setPagination({
        ...newPagination,
        total: result.totalElement,
      })
    })
    .catch((error) => {
      const response = getDataApi(error);
      toastError(response.message)
    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    loadData(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleTableChange = (newPagination, _, sorter) => {
    loadData(newPagination);
  };
  return (
    <div className='history'>
      {!data && <LineLoading />}
      {data && <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey="id"
        scroll={{
          x: "max-content",
          y: 400
        }}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          // showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: showTotal
        }}
        className='table'
      />}
      {viewDetailId && <ModalCustom onClose={handleCloseViewDetail}>
        <DetailHistory />
      </ModalCustom>}
    </div>
  );
};

export default History;