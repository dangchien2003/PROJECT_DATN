import { adminSearch } from "@/service/cardService";
import { setSearching } from "@/store/startSearchSlice";
import { getDataApi } from "@/utils/api";
import { CARD_STATUS, CARD_TYPE } from "@/utils/constants";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    title: "Số thẻ",
    dataIndex: "numberCard",
    key: "1",
  },
  {
    title: "Ngày phát hành",
    dataIndex: "issuedDatePrint",
    key: "2",
    align: "center"
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "3",
    sorter: false,
  },
  {
    title: "Loại thẻ",
    dataIndex: "typePrint",
    key: "4",
    sorter: false,
  },
  {
    title: "Người yêu cầu",
    dataIndex: "requestName",
    key: "5",
  },
];

const convertResponseToDataTable = (data, currentPage, pageSize) => {
  return data.map((item, index) => {
    item.issuedDatePrint = formatTimestamp(item.issuedDate, "DD/MM/YYYY")
    item.statusPrint = (<ButtonStatus color={CARD_STATUS[item.status]?.color} label={CARD_STATUS[item.status]?.label} />)
    item.typePrint = CARD_TYPE[item.type]?.label
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableListCard = ({ dataSearch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSearching } = useSelector(state => state.startSearch);
  const [firstSearch, setFirstSearch] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
    adminSearch(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
      .then((response) => {
        const result = getDataApi(response);
        const total = result?.totalElements;
        setData(
          convertResponseToDataTable(
            result.data,
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
    setPagination(newPagination);
    loadData(newPagination, sorter);
  };

  const handleClickRow = (data) => {
    navigate(`/card/detail/0/${data.numberCard}`)
  };

  useEffect(() => {
    if (isSearching || !firstSearch) {
      loadData(pagination, sorter);
      if (!firstSearch) {
        setFirstSearch(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching]);
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
        showTotal: showTotal
      }}
      onRow={(record) => {
        return {
          onClick: () => handleClickRow(record),
        };
      }}
    />
  );
};

export default TableListCard;
