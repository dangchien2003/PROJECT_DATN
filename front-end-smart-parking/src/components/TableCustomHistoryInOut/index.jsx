import { useState, useEffect } from "react";
import { Table } from "antd";
import { convertToTime, formatTimestamp } from "@/utils/time";
import { dataInOut } from "./dataTest";
import ButtonStatus from "../ButtonStatus";
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
    title: "checkin",
    dataIndex: "checkin",
    key: "1",
    sorter: false,
    width: 100,
  },
  {
    title: "checkout",
    dataIndex: "checkout",
    key: "2",
    sorter: false,
    width: 100,
  },
  {
    title: "Tổng thời gian",
    dataIndex: "total",
    key: "3",
    sorter: false,
    width: 100,
  },
  {
    title: "Địa điểm",
    dataIndex: "locationPrint",
    key: "4",
    sorter: false,
    width: 200,
  },
];

const convertResponseToDataTable = (response, currentPage, pageSize) => {
  return response.data.map((item, index) => {
    item.checkin = (
      <>
        {formatTimestamp(item.checkinAt, "DD/MM/YYYY")}
        <br />
        {formatTimestamp(item.checkinAt, "HH:mm:ss")}
      </>
    );
    if (item.checkoutAt !== null) {
      item.checkout = (
        <>
          {formatTimestamp(item.checkoutAt, "DD/MM/YYYY")}
          <br />
          {formatTimestamp(item.checkoutAt, "HH:mm:ss")}
        </>
      );
      item.total = `${convertToTime(item.checkoutAt - item.checkinAt)}`;
    } else {
      item.total = (
        <>
          <ButtonStatus label="Đã đỗ" color="danger" />
          <br />
          {convertToTime(new Date().getTime() - item.checkinAt)}
        </>
      );
    }
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomHistoryInOut = () => {
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
        data: dataInOut,
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

export default TableCustomHistoryInOut;
