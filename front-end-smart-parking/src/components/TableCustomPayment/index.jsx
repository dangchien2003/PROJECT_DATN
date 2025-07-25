import { getTransactionOfCustomer } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import {
  COLOR_BUTTON_ACCOUNT_STATUS,
  COLORS_CHART,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from "@/utils/constants";
import { formatCurrency } from "@/utils/number";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import ButtonStatus from "../ButtonStatus";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Thanh toán",
    dataIndex: "typePrint",
    align: "center",
    key: "1",
    sorter: false,
    width: 150,
  },
  {
    title: "Hình thức",
    dataIndex: "methodPrint",
    align: "center",
    key: "2",
    sorter: false,
    width: 120,
  },
  {
    title: "Thời gian",
    dataIndex: "createdTime",
    align: "center",
    key: "3",
    sorter: false,
    width: 120,
  },
  {
    title: "Số tiền",
    dataIndex: "totalPrint",
    key: "4",
    sorter: false,
    width: 120,
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "5",
    sorter: false,
    width: 150,
  },
];

const convertResponseToDataTable = (data, currentPage, pageSize) => {
  const now = new Date().getTime();
  return data.map((item, index) => {
    item.totalPrint = (
      <span>
        {item.type === 2 ? (
          <FaAngleDoubleUp color={COLORS_CHART[1]} />
        ) : (
          <FaAngleDoubleDown color={COLORS_CHART[3]} />
        )}
        {formatCurrency(item.total) + " đ"}
      </span>
    );
    item.createdTime = formatTimestamp(item.createdAt);
    item.methodPrint = PAYMENT_METHOD[item.paymentMethod];
    item.typePrint = PAYMENT_TYPE[item.type];
    item.statusPrint = (
      <>
        <ButtonStatus
          label={PAYMENT_STATUS[item.status].label}
          color={PAYMENT_STATUS[item.status].color}
        />
      </>
    );
    item.ticketNamePrint = (
      <>
        <div style={{ textAlign: "center" }}>
          {now > item.expires ? (
            <ButtonStatus
              label="Đã hết hạn"
              color={COLOR_BUTTON_ACCOUNT_STATUS[0]}
            />
          ) : (
            <ButtonStatus
              label="Bình thường"
              color={COLOR_BUTTON_ACCOUNT_STATUS[2]}
            />
          )}
        </div>
        {`${item.idTicket} - ${item.ticketName}`}
      </>
    );
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomPayment = ({accountId}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadData = (newPagination) => {
    setLoading(true);
    setData([])
    getTransactionOfCustomer(accountId, newPagination.current - 1, newPagination.pageSize)
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
        setLoading(false);
      });
  };

  const handleTableChange = (newPagination, _, sorter) => {
    setPagination(newPagination);
    loadData(newPagination, sorter);
  };

  useEffect(() => {
    loadData(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Table
      columns={columns}
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
        showTotal: showTotal,
      }}
    />
  );
};

export default TableCustomPayment;
