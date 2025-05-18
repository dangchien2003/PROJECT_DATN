import { useState, useEffect } from "react";
import { Table } from "antd";
import {
  ACCOUNT_STATUS_OBJECT,
  COLOR_BUTTON_ACCOUNT_STATUS,
} from "@/utils/constants";
import ButtonStatus from "../ButtonStatus";
import { formatCurrency } from "@/utils/number";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";
import { searchAccountCustomer } from "@/service/accountService";
import { convertDataSort, getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
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
    title: "Tên tài khoản",
    dataIndex: "fullName",
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
    title: "Trạng thái",
    dataIndex: "status",
    key: "2",
    sorter: false,
    width: 150,
  },
  {
    title: "Số dư",
    dataIndex: "balance",
    key: "5",
    sorter: true,
    width: 200,
  },
];

const convertResponseToDataTable = (data, currentPage, pageSize) => {
  return data.map((item, index) => {
    item.status = (
      <ButtonStatus
        color={COLOR_BUTTON_ACCOUNT_STATUS[item.status]}
        label={ACCOUNT_STATUS_OBJECT[item.status]}
      />
    );
    item.balance = (item.balance === 0 ? 0 : formatCurrency(item.balance)) + " đ";
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomListAccountCustomer = ({dataSearch}) => {
  const navigate = useNavigate();
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter] = useState({
    field: null,
    order: null,
  });

  const loadData = (newPagination, sorter) => {
    setLoading(true);
    setData([]);

    searchAccountCustomer(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
      .then((response) => {
        const data = getDataApi(response);
        const total = response.data?.result?.totalElements;
        setData(
          convertResponseToDataTable(
            data,
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
        dispatch(setSearching(false))
      });
  };

  const handleTableChange = (newPagination, _, sorter) => {
    convertDataSort(sorter)
    loadData(newPagination, sorter);
  };

  useEffect(() => {
    if(isSearching || !firstSearch) {
      loadData(pagination, sorter);
      if(!firstSearch) {
        setFirstSearch(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching]);

  const handleClickRow = (data) => {
    navigate(`/admin/account/customer/${data.id}`);
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

export default TableCustomListAccountCustomer;
