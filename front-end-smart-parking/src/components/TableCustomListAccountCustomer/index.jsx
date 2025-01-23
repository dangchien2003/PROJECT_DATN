import { useState, useEffect } from "react";
import { Table } from "antd";
import {
  ACCOUNT_STATUS_OBJECT,
  COLOR_BUTTON_ACCOUNT_STATUS,
} from "@/utils/constants";
import ButtonStatus from "../ButtonStatus";
import { formatCurrency } from "@/utils/number";
import { useNavigate } from "react-router-dom";

const convertResponseToDataTable = (response) => {
  return response.data.map((item) => {
    item.status = (
      <ButtonStatus
        color={COLOR_BUTTON_ACCOUNT_STATUS[item.status]}
        label={ACCOUNT_STATUS_OBJECT[item.status]}
      />
    );
    item.balance = formatCurrency(item.balance) + " đ";
    return item;
  });
};

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 50,
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "1",
    sorter: false,
    width: 200,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "2",
    sorter: false,
    width: 150,
  },
  {
    title: "Tên tài khoản",
    dataIndex: "full_name",
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
    title: "Số dư",
    dataIndex: "balance",
    key: "5",
    sorter: true,
    width: 200,
  },
];

const TableCustomListAccountCustomer = () => {
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
        data: [
          {
            id: 1,
            status: 1,
            full_name: "Lê Đăng Chiến",
            email: "dangchien@gmail.com",
            balance: 100000,
          },
          {
            id: 2,
            status: 2,
            full_name: "Lê Đăng Chiến",
            email: "dangchien@gmail.com",
            balance: 100000,
          },
          {
            id: 3,
            status: 0,
            full_name: "Lê Đăng Chiến",
            email: "dangchien@gmail.com",
            balance: 100000,
          },
          {
            id: 4,
            status: 1,
            full_name: "Lê Đăng Chiến",
            email: "dangchien@gmail.com",
            balance: 100000,
          },
          {
            id: 5,
            status: 1,
            full_name: "Lê Đăng Chiến",
            email: "dangchien@gmail.com",
            balance: 100000,
          },
        ],
        totalElement: 60,
        totalPage: 10,
      };
      setData(convertResponseToDataTable(dataResponse));
      setPagination({
        ...newPagination,
        total: dataResponse.totalElement,
      });
    }, 1000);
  };
  const handleTableChange = (newPagination, _, sorter) => {
    loadData(newPagination, sorter);
  };

  useEffect(() => {
    loadData(pagination, sorter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickRow = (data) => {
    navigate(`/account/customer/${data.id}`);
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
      onChange={handleTableChange} // Gọi API khi có thay đổi
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

export default TableCustomListAccountCustomer;
