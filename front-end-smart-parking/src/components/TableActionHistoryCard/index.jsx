import { useState, useEffect } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import { listPartner } from "./dataTest";
import { formatTimestamp } from "@/utils/time";
import { showTotal } from "@/utils/table";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 50,
  },
  {
    title: "Vé liên kết",
    dataIndex: "ticketPurchasedId",
    key: "1",
    sorter: false,
    width: 200,
  },
  {
    title: "Thời gian sử dụng",
    dataIndex: "usedTime",
    key: "2",
    sorter: false,
    width: 150,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "3",
    sorter: false,
    width: 120,
  }
];

const convertResponseToDataTable = (response, currentPage, pageSize) => {
  return response.data.map((item, index) => {
    item.usedTime = formatTimestamp(item.usedAt, "DD/MM/YYYY HH:mm:ss")
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableActionHistoryCard = () => {
  const navigate = useNavigate();
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
        data: listPartner,
        totalElement: 50,
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

  const handleClickRow = (data) => {
    navigate(`/admin/account/partner/${data.id}`);
  };

  return (
    <Table
    style={{width: "100%"}}
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
      onRow={(record) => {
        return {
          onClick: () => handleClickRow(record),
        };
      }}
    />
  );
};

export default TableActionHistoryCard;
