import { Table } from 'antd';
import './style.css'
import { useEffect, useState } from 'react';
import { showTotal } from '@/utils/table';
import LineLoading from '@/components/Loading/LineLoading';
import { GoDotFill } from 'react-icons/go';
import { FaEye } from 'react-icons/fa6';
import ModalCustom from '@/components/ModalCustom';
import DetailHistory from './DetailHistory';
const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Giờ vào",
    dataIndex: "checkinAt",
    key: "1",
    width: 120,
    align: "center"
  },
  {
    title: "Giờ ra",
    dataIndex: "checkoutAt",
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
    width: 50,
    align: "center",
    fixed: "right",
  }
];

const History = () => {
  const [viewDetailId, setViewDetailId] = useState(null);
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleViewDetail = ()=> {
    setViewDetailId(1)
  }

  const handleCloseViewDetail = ()=> {
    setViewDetailId(null)
  }

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          stt: 1,
          checkinAt: "10:30 11/11/2025",
          checkoutAt: null,
          statusPrint: <div className='status'>
            <GoDotFill style={{ color: 'yellow' }} /> Đang gửi
          </div>,
          view: <FaEye className='pointer' onClick={handleViewDetail} />
        }, 
        {
          stt: 2,
          checkinAt: "07:00 11/11/2025",
          checkoutAt: "10:00 11/11/2025",
          statusPrint: <div className='status'>
            <GoDotFill style={{ color: 'green' }} /> Hoàn thành
          </div>,
          view: <FaEye className='pointer' onClick={handleViewDetail} />
        }
      ]);
    }, 1000)
  }, [])
  return (
    <div>
      {!data && <LineLoading />}
      {data && <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        scroll={{
          x: "max-content",
        }}
        // onChange={handleTableChange}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: showTotal
        }}
      />}
      {viewDetailId && <ModalCustom onClose={handleCloseViewDetail}>
        <DetailHistory />
        </ModalCustom>}
    </div>
  );
};

export default History;