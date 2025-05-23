import { useState, useEffect } from "react";
import { Table } from "antd";
import { fakeDataTable } from "./dataTest";
import { VEHICLE } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { formatCurrency } from "@/utils/number";
import { showTotal } from "@/utils/table";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 0,
  },
  {
    title: "Vé",
    dataIndex: "ticketNamePrint",
    key: "1",
    sorter: false,
    width: 150,
  },
  {
    title: "Số tiền",
    dataIndex: "pricePrint",
    key: "2",
    sorter: false,
    width: 120,
  },
  {
    title: "Phương tiện",
    dataIndex: "vehiclePrint",
    key: "3",
    sorter: false,
    width: 120,
  },
  {
    title: "Đã bán",
    dataIndex: "buyTime",
    align: "center",
    key: "4",
    sorter: false,
    width: 120,
  },
];

const convertResponseToDataTable = (response, currentPage, pageSize) => {
  return response.data.map((item, index) => {
    item.vehiclePrint = (
      <div>
        <span style={{ margin: "0 4px" }}>{VEHICLE[item.vehicle].icon}</span>
        {VEHICLE[item.vehicle].name}
      </div>
    );
    item.pricePrint = formatCurrency(item.price) + " đ";
    item.ticketNamePrint = (
      <div>
        <div style={{ textAlign: "center" }}>{item.id}</div>
        <div>{`${item.idTicket} - ${item.ticketName}`}</div>
      </div>
    );
    item.buyTime = (
      <div>
        {formatTimestamp(item.createdAt, "DD/MM/YYYY")} <br />
        {formatTimestamp(item.createdAt, "HH:mm:ss")}
      </div>
    );
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomSaleTicketOfPartner = () => {
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
        data: fakeDataTable,
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

export default TableCustomSaleTicketOfPartner;
