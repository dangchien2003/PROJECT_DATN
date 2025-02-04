import { useState, useEffect } from "react";
import { Table } from "antd";
import {
  ACCOUNT_STATUS_OBJECT,
  COLOR_BUTTON_ACCOUNT_STATUS,
} from "@/utils/constants";
import ButtonStatus from "../ButtonStatus";
import { useNavigate } from "react-router-dom";
import { listPartner } from "./dataTest";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 50,
  },
  {
    title: "ID - AccountId",
    dataIndex: "idPrint",
    key: "1",
    sorter: false,
    width: 200,
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "2",
    sorter: false,
    width: 150,
  },
  {
    title: "Tên đối tác",
    dataIndex: "partnerFullName",
    key: "3",
    sorter: true,
    width: 200,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "4",
    sorter: true,
    width: 200,
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "5",
    sorter: true,
    width: 200,
  },
];

const convertResponseToDataTable = (response, currentPage, pageSize) => {
  return response.data.map((item, index) => {
    item.statusPrint = (
      <ButtonStatus
        color={COLOR_BUTTON_ACCOUNT_STATUS[item.status]}
        label={ACCOUNT_STATUS_OBJECT[item.status]}
      />
    );
    item.idPrint = item.id + " - " + item.accountId;
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomListPartner = () => {
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
    navigate(`/account/partner/${data.id}`);
  };

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
      onRow={(record) => {
        return {
          onClick: () => handleClickRow(record),
        };
      }}
    />
  );
};

export default TableCustomListPartner;
