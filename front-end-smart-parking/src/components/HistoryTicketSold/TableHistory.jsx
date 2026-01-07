import { historyBuyTicket } from "@/service/ticketPurchasedService";
import { setSearching } from "@/store/startSearchSlice";
import { getDataApi } from "@/utils/api";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaBan, FaEye } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../ModalCustom";
import CancelTicket from "./CancelTicket";
import DetailTicket from "./DetailTicket";

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
    align: "center",
    fixed: "right"
  },
];

const dataComboboxTinhTrang = {
  1: "Chưa có hiệu lực",
  2: "Còn hiệu lực",
  3: "Hết hiệu lực",
}

const TableHistory = ({ dataSearch }) => {
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [firstSearch, setFirstSearch] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleCancelTicket = (item) => {
    setShowConfirmCancel(item);
  }

  const closeModal = () => {
    setShowDetail(null);
    setShowConfirmCancel(null);
  }

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.nguoiMua = item.personBuy;
      item.nguoiHuong = item.owner;
      item.tinhTrang = dataComboboxTinhTrang[item.status];
      item.tgBatDau = formatTimestamp(item.startsValidity, "DD/MM/YYYY HH:mm")
      item.hetHan = formatTimestamp(item.expires, "DD/MM/YYYY HH:mm")
      item.soLan = item.usedTimes;
      item.action = (
        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <Tooltip title="Chi tiết">
            <div onClick={() => setShowDetail(item)}>
              <FaEye style={{ fontSize: 21, cursor: 'pointer'}} />
            </div>
          </Tooltip>
          {(item.status === 1 || item.status === 2) && <Tooltip title="Huỷ vé">
            <div onClick={() => handleCancelTicket(item)}>
              <FaBan style={{ fontSize: 21, cursor: 'pointer', color: "red" }} />
            </div>
          </Tooltip>}
        </div>
      );
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
    <>
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
      {
        showConfirmCancel &&
        <CancelTicket data={showConfirmCancel} handleClose={closeModal} />
      }
      {
        showDetail &&
        <ModalCustom onClose={closeModal}>
          <div style={{margin: 30}}>
            <DetailTicket id={showDetail.id}/>
          </div>
        </ModalCustom>
      }
    </>
  );
};

export default TableHistory;
