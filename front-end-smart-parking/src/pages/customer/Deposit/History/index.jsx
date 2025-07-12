import { cancelRequest, getHistory } from '@/service/depositService';
import { getDataApi } from '@/utils/api';
import { formatCurrency } from '@/utils/number';
import { showTotal } from '@/utils/table';
import { toastError } from '@/utils/toast';
import { Table, Tooltip } from 'antd';
import dayjs from "dayjs";
import { useEffect, useState } from 'react';
import { ImCancelCircle } from "react-icons/im";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { IoTimer } from 'react-icons/io5';
import './style.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useLoading } from '@/hook/loading';
import { lineLoading } from '@/utils/constants';

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
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "6",
    align: "center",
    scroll: true
  }
];
const History = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { showLoad, hideLoad } = useLoading();

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
          <ImCancelCircle /> Thất bại
        </div>
      } else if (item.status === 3) {
        item.statusPrint = <div className='cancel'>
          <ImCancelCircle /> Huỷ yêu cầu
        </div>
      }
      // phương thức thanh toán
      item.paymentMethodPrint = null;
      if (item.paymentMethod === 1) {
        item.paymentMethodPrint = "VNPAY";
      } else if (item.paymentMethod === 2) {
        item.paymentMethodPrint = "Ngân hàng";
      }
      // hành động
      item.action = <div>
        <Tooltip title="Hủy">
          <FaTrashAlt
            className={item.status === 0 ? "cancel-hover" : "disable"}
            onClick={item.status === 0 ? () => { handleCancelRequest(item) } : null} />
        </Tooltip>
      </div>
      item.createdDate = dayjs(item.createdAt).format("DD/MM/YYYY");
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    })
  }

  const handleCancelRequest = (item) => {
    showLoad(lineLoading);
    cancelRequest(item.id)
      .then(() => {
        item.status = 3;
        setData(prev => convertResponseToDataTable([...prev], pagination.current, pagination.pageSize));
      })
      .finally(hideLoad);
  };


  const loadData = (newPagination) => {
    setLoading(true);
    getHistory(newPagination.current - 1, newPagination.pageSize).then(response => {
      const result = getDataApi(response);
      setData(convertResponseToDataTable(result.data, newPagination.current,
        newPagination.pageSize));
      setPagination({
        ...newPagination,
        total: result.totalElements,
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

  const handleTableChange = (newPagination, _, __) => {
    loadData(newPagination);
  };

  return (
    <div className='history'>
      <h2 className='page-name'>Lịch sử nạp</h2>
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
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: showTotal
        }}
      />
    </div>
  );
};

export default History;