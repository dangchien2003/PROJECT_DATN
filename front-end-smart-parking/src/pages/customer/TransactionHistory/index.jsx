import ChildContent from '@/components/layout/Customer/ChildContent';
import { customerGetHistory } from '@/service/transactionService';
import { setSearching } from '@/store/startSearchSlice';
import { getDataApi } from '@/utils/api';
import { TYPE_TRANSACTION } from '@/utils/constants';
import { formatCurrency } from '@/utils/number';
import { convertDataSelectboxToObject, convertObjectToDataSelectBox } from '@/utils/object';
import { showTotal } from '@/utils/table';
import { toastError } from '@/utils/toast';
import { Table } from 'antd';
import dayjs from "dayjs";
import { useEffect, useState } from 'react';
import { ImCancelCircle } from "react-icons/im";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { IoTimer } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import Search from './Search';
import './style.css';

const baseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "1",
    width: 50,
    align: "center"
  },
  {
    title: "Mục đích",
    dataIndex: "typePrint",
    key: "2",
    align: "left",
    width: 200
  },
  {
    title: "Biến động",
    dataIndex: "fluctuationPrint",
    key: "2",
    align: "left",
    width: 150
  },
  {
    title: "Số tiền",
    dataIndex: "totalPrint",
    key: "3",
    align: "left",
    width: 150
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "3",
    align: "left",
    width: 150
  },
  {
    title: "Nội dung giao dịch",
    dataIndex: "content",
    key: "4",
    align: "left",
    width: 250
  },
  {
    title: "Thời điểm giao dịch",
    dataIndex: "createdTime",
    key: "5",
    align: "Center",
    width: 180,
  }
];
const typeTransaction = convertDataSelectboxToObject(convertObjectToDataSelectBox(TYPE_TRANSACTION))
const TransactionHistory = () => {
  const dispatch = useDispatch();
  const { isSearching } = useSelector(state => state.startSearch)
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataSearch] = useState({
    type: null,
    transactionDate: null
  })

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.typePrint = typeTransaction[item.type].label;
      // Biến động
      if (item.fluctuation === 1) {
        item.fluctuationPrint = "Cộng";
      } else if (item.fluctuation === 2) {
        item.fluctuationPrint = "Trừ";
      }

      item.totalPrint = <div>{formatCurrency(item.total)}<sup>Đ</sup></div>;
      // trạng thái
      item.statusPrint = "";
      if (item.status === 0) {
        item.statusPrint = <div><IoTimer /> Chờ thanh toán</div>
      } else if (item.status === 1) {
        item.statusPrint = <div className='success'>
          <IoTimer /> Đang xử lý
        </div>
      } else if (item.status === 2) {
        item.statusPrint = <div className='success'>
          <IoMdCheckmarkCircleOutline /> Hoàn thành
        </div>
      } else if (item.status === 3) {
        item.statusPrint = <div className='cancel'>
          <ImCancelCircle /> Thất bại
        </div>
      }

      // phương thức thanh toán
      item.paymentMethodPrint = null;
      if (item.paymentMethod === 1) {
        item.paymentMethodPrint = "VNPAY";
      } else if (item.paymentMethod === 2) {
        item.paymentMethodPrint = "Ngân hàng";
      }

      item.createdTime = dayjs(item.createdAt).format("HH:mm:ss DD/MM/YYYY");
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    })
  }

  useEffect(() => {
    loadData(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleTableChange = (newPagination) => {
    loadData(newPagination);
  };

  useEffect(() => {
    if (!isSearching) return;
    loadData(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [isSearching])

  const loadData = (newPagination) => {
    setData([])
    customerGetHistory(dataSearch, newPagination.current - 1, pagination.pageSize)
      .then((response) => {
        const data = getDataApi(response);
        const total = data?.totalElements;
        setData(
          convertResponseToDataTable(
            data.data,
            newPagination.current,
            newPagination.pageSize
          )
        );
        setPagination({
          ...newPagination,
          total: total,
        });
      })
      .catch((error) => {
        error = getDataApi(error);
        toastError(error.message)
      })
      .finally(() => {
        dispatch(setSearching(false))
      });
  }
  return (
    <div className='transaction-history'>
      <ChildContent>
        <h2 className='page-name'>Lịch sử giao dịch</h2>
        <div className='space-box'>
          <Search dataSearch={dataSearch} />
        </div>
        <div className="content-page">
          <Table
            columns={baseColumns}
            dataSource={data}
            rowKey="id"
            loading={isSearching}
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
      </ChildContent>
    </div>
  );
};

export default TransactionHistory;