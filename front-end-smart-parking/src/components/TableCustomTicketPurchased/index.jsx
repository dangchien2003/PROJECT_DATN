import { useState, useEffect } from "react";
import { Table } from "antd";
import { fakeTickets } from "./dataTest";
import { formatCurrency } from "@/utils/number";
import { formatTimestamp } from "@/utils/time";
import ButtonStatus from "../ButtonStatus";
import { COLOR_BUTTON_ACCOUNT_STATUS } from "@/utils/constants";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Vé đã mua",
    dataIndex: "ticketNamePrint",
    key: "1",
    sorter: false,
    width: 150,
  },
  {
    title: "Người mua",
    dataIndex: "purchasedBy",
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
    dataIndex: "partnerFullName",
    key: "5",
    sorter: false,
    width: 200,
  },
];

const convertResponseToDataTable = (response, currentPage, pageSize) => {
  const now = new Date().getTime();
  return response.data.map((item, index) => {
    item.pricePrint = formatCurrency(item.price) + " đ";
    item.buyAt = formatTimestamp(item.createdAt);
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

const TableCustomTicketPurchased = () => {
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
    setTimeout(() => {
      setLoading(false);
      const dataResponse = {
        data: fakeTickets,
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
      }}
    />
  );
};

export default TableCustomTicketPurchased;
