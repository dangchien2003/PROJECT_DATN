import { Table } from 'antd';
import './style.css'
import { useEffect, useState } from 'react';
import { showTotal } from '@/utils/table';
import { dataCardFake } from './fakeData';
import { IoCard, IoTimer } from 'react-icons/io5';
import { MdCreditCardOff } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { ImCancelCircle } from "react-icons/im";
import dayjs from "dayjs"
import { formatCurrency } from '@/utils/number';

const baseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "1",
    width: 50,
    align: "center"
  },
  {
    title: "Số tiền",
    dataIndex: "totalPrint",
    key: "2",
    align: "left"
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "3",
    align: "left"
  },
  {
    title: "Ngày nạp",
    dataIndex: "createdDate",
    key: "4",
    align: "center",
    width: 150,
    scroll: true
  },
  {
    title: "Phương thức",
    dataIndex: "paymentMethodPrint",
    key: "5",
    align: "left",
    scroll: true
  }
];
const History = () => {
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
      item.totalPrint = <div>{formatCurrency(item.total)}<sup>Đ</sup></div>;
      // trạng thái
      item.statusPrint = "";
      if (item.status === 0) {
        item.statusPrint = <div><IoTimer /> Chờ thanh toán</div>
      } else if (item.status === 1) {
        item.statusPrint = <div className='success'>
          <IoMdCheckmarkCircleOutline /> Hoàn thành
        </div>
      } else if (item.status === 2) {
        item.statusPrint = <div className='cancel'>
          <ImCancelCircle /> Hết hạn
        </div>
      } else if (item.status === 3) {
        item.statusPrint = <div className='cancel'>
          <ImCancelCircle /> Huỷ giao dịch
        </div>
      } else if (item.status === 4) {
        item.statusPrint = <div className='cancel'>
          <ImCancelCircle /> Từ chối
        </div>
      }
      // phương thức thanh toán
      item.paymentMethodPrint = null;
      if (item.paymentMethod === 1) {
        item.paymentMethodPrint = "VNPAY";
      } else if (item.paymentMethod === 2) {
        item.paymentMethodPrint = "Ngân hàng";
      }

      item.createdDate = dayjs(item.createdAt).format("DD/MM/YYYY");
      item.stt = (currentPage - 1) * pageSize + index + 1;
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
    <div className='history'>
      <h2 className='page-name'>Lịch sử nạp</h2>
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
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: showTotal
        }}
      />
    </div>
  );
};

export default History;