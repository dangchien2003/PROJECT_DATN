import { historyBuyTicket } from "@/service/ticketPurchasedService";
import { setSearching } from "@/store/startSearchSlice";
import { getDataApi } from "@/utils/api";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const baseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Người mua",
    dataIndex: "nguoiMua",
    key: "1",
    width: 150,
  },
  {
    title: "Người hưởng",
    dataIndex: "nguoiHuong",
    key: "2",
    sorter: false,
    width: 150,
  },
  {
    title: "Tình Trạng",
    dataIndex: "tinhTrang",
    key: "3",
    sorter: false,
    width: 150,
  },
  {
    title: "Bắt đầu hiệu lực",
    dataIndex: "tgBatDau",
    key: "4",
    sorter: false,
    width: 150,
    align: "center"
  },
  {
    title: "Hết hiệu lực",
    dataIndex: "hetHan",
    key: "5",
    sorter: false,
    width: 150,
    align: "center"
  },
  {
    title: "Số lần sử dụng",
    dataIndex: "soLan",
    key: "6",
    sorter: false,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "7",
    sorter: false,
    width: 150,
    fixed: "right"
  },
];

const dataComboboxTinhTrang = {
  1: "Chưa có hiệu lực",
  2: "Còn hiệu lực",
  3: "Hết hiệu lực",
}

const TableHistory = ({ dataSearch }) => {
  const navigate = useNavigate()
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.nguoiMua = item.personBuy;
      item.nguoiHuong = item.owner;
      item.tinhTrang = dataComboboxTinhTrang[item.status];
      item.tgBatDau = formatTimestamp(item.startsValidity, "DD/MM/YYYY HH:mm")
      item.hetHan = formatTimestamp(item.expires, "DD/MM/YYYY HH:mm")
      item.soLan = item.usedTimes;
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  const loadData = (newPagination) => {
    setLoading(true);
    setData([])
    historyBuyTicket(dataSearch, newPagination.current - 1, newPagination.pageSize)
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
        dispatch(setSearching(false))
      });
  };

  const handleTableChange = (newPagination) => {
    loadData(newPagination);
  };

  useEffect(() => {
    if (isSearching || !firstSearch) {
      loadData(pagination);
      if (!firstSearch) {
        setFirstSearch(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching]);
  return (
    <Table
      columns={baseColumns}
      dataSource={data}
      rowKey="modifyId"
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

export default TableHistory;
