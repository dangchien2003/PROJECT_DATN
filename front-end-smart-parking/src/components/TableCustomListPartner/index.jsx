import { useState, useEffect } from "react";
import { Table } from "antd";
import {
  ACCOUNT_STATUS_OBJECT,
  COLOR_BUTTON_ACCOUNT_STATUS,
} from "@/utils/constants";
import ButtonStatus from "../ButtonStatus";
import { useNavigate } from "react-router-dom";
import { convertDataSort, getDataApi } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { searchPartner } from "@/service/accountService";
import { setSearching } from "@/store/startSearchSlice";
import { toastError } from "@/utils/toast";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 50,
  },
  {
    title: "Tên đối tác",
    dataIndex: "partnerFullName",
    key: "1",
    sorter: true,
    width: 150,
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "2",
    sorter: false,
    width: 100,
  },
  {
    title: "Email",
    dataIndex: "partnerEmail",
    key: "3",
    sorter: true,
    width: 200,
  },
  {
    title: "Địa chỉ",
    dataIndex: "partnerAddress",
    key: "4",
    sorter: true,
    width: 400,
  },
];

const convertResponseToDataTable = (data, currentPage, pageSize) => {
  return data.map((item, index) => {
    item.statusPrint = (
      <ButtonStatus
        color={COLOR_BUTTON_ACCOUNT_STATUS[item.status]}
        label={ACCOUNT_STATUS_OBJECT[item.status]}
      />
    );
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomListPartner = ({dataSearch}) => {
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
    searchPartner(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
      .then((response) => {
        const data = response.data?.result?.data;
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
