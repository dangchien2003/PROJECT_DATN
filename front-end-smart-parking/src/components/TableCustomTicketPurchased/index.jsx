import { getTicketOfCustomer } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import { COLOR_BUTTON_ACCOUNT_STATUS, TICKET_PURCHASED_STATUS } from "@/utils/constants";
import { formatCurrency } from "@/utils/number";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table } from "antd";
import { useEffect, useState } from "react";
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
    title: "Id",
    dataIndex: "ticketPrint",
    key: "0.5",
    sorter: false,
    width: 150,
  },
  {
    title: "Tên vé",
    dataIndex: "ticketName",
    key: "1",
    sorter: false,
    width: 150,
  },
  {
    title: "Người mua",
    dataIndex: "createdName",
    key: "2",
    sorter: false,
    width: 150,
  },
  {
    title: "Thời gian",
    dataIndex: "buyAt",
    key: "3",
    sorter: false,
    width: 100,
  },
  {
    title: "Giá vé",
    dataIndex: "pricePrint",
    key: "4",
    sorter: false,
    width: 100,
  },
  {
    title: "Đối tác cung cấp",
    dataIndex: "supplier",
    key: "5",
    sorter: false,
    width: 200,
  },
];

const convertResponseToDataTable = (data, currentPage, pageSize) => {
  return data.map((item, index) => {
    item.pricePrint = formatCurrency(item.price) + " đ";
    item.buyAt = formatTimestamp(item.createdAt);
    item.ticketPrint = 
      <>
        <div>
          {item.status === TICKET_PURCHASED_STATUS.HUY_VE.value &&  (
            <ButtonStatus
              label={TICKET_PURCHASED_STATUS.HUY_VE.label}
              color={COLOR_BUTTON_ACCOUNT_STATUS[0]}
            />
          )}
          {item.status === TICKET_PURCHASED_STATUS.BINH_THUONG.value &&  (
            <ButtonStatus
              label={TICKET_PURCHASED_STATUS.BINH_THUONG.label}
              color={COLOR_BUTTON_ACCOUNT_STATUS[2]}
            />
          )}
          {item.status === TICKET_PURCHASED_STATUS.BI_DINH_CHI.lavalueel &&  (
            <ButtonStatus
              label={TICKET_PURCHASED_STATUS.BI_DINH_CHI.label}
              color={COLOR_BUTTON_ACCOUNT_STATUS[2]}
            />
          )}
          {item.status === TICKET_PURCHASED_STATUS.TAM_DINH_CHI.value &&  (
            <ButtonStatus
              label={TICKET_PURCHASED_STATUS.TAM_DINH_CHI.label}
              color={COLOR_BUTTON_ACCOUNT_STATUS[2]}
            />
          )}
        </div>
        {item.id}
      </>
    ;
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomTicketPurchased = ({accountId}) => {
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
    getTicketOfCustomer(accountId, newPagination.current - 1, newPagination.pageSize)
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

export default TableCustomTicketPurchased;
