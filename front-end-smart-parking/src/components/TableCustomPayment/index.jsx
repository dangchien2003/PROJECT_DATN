import { useState, useEffect } from "react";
import { Table } from "antd";
import { fakePayment } from "./dataTest";
import { formatCurrency } from "@/utils/number";
import { formatTimestamp } from "@/utils/time";
import ButtonStatus from "../ButtonStatus";
import {
  COLOR_BUTTON_ACCOUNT_STATUS,
  COLORS_CHART,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from "@/utils/constants";
import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";
import { showTotal } from "@/utils/table";

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

const convertResponseToDataTable = (response, currentPage, pageSize) => {
  const now = new Date().getTime();
  return response.data.map((item, index) => {
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

const TableCustomPayment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState({
    field: "name",
    order: "ascend",
  });

  const loadData = (newPagination, sorter) => {
    if (!sorter.field || !sorter.order) {
      sorter = {
        field: "name",
        order: "ascend",
      };
      setSorter(sorter);
    }
    setLoading(true);
    setData([]);
    setTimeout(() => {
      setLoading(false);
      const dataResponse = {
        data: fakePayment,
        totalElement: 60,
        totalPage: 10,
      };
      setData(
        convertResponseToDataTable(
          dataResponse,
          newPagination.current,
          newPagination.pageSize
        )
      );
      setPagination({
        ...newPagination,
        total: dataResponse.totalElement,
      });
    }, 1000);
  };

  const handleTableChange = (newPagination, _, sorter) => {
    setPagination(newPagination);
    loadData(newPagination, sorter);
  };

  useEffect(() => {
    loadData(pagination, sorter);
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
