import ButtonStatus from "@/components/ButtonStatus";
import ModalCustom from "@/components/ModalCustom";
import QrTicket from "@/components/QrTicket";
import { getTicketPurchased } from "@/service/ticketPurchasedService";
import { setSearching } from "@/store/startSearchSlice";
import { getDataApi } from "@/utils/api";
import { TICKET_PURCHASED_STATUS } from "@/utils/constants";
import { convertDataSelectboxToObject } from "@/utils/object";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import { LiaQrcodeSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const baseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Mã vé",
    dataIndex: "id",
    key: "1",
    width: 200,
    align: "left"
  },
  {
    title: "Tên vé",
    dataIndex: "ticketName",
    key: "1",
    width: 200,
    align: "left"
  },
  {
    title: "Ngày mua",
    dataIndex: "createdTime",
    key: "2",
    // sorter: true,
    width: 120,
    align: "center"
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "3",
    width: 120,
    // sorter: true,
    align: "left"
  },
  {
    title: "Hạn sử dụng",
    dataIndex: "expireTime",
    key: "4",
    sorter: false,
    width: 200,
    align: "left"
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "6",
    fixed: "right",
    width: 120,
    align: "center"
  }
];

const ticketPurchasedStatus = convertDataSelectboxToObject(TICKET_PURCHASED_STATUS);
const TableList = ({ dataSearch }) => {
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  // const [columns, setColumns] = useState(baseColumns);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [dataTicketShowQr, setDataTicketShowQr] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadData = (newPagination) => {
    setLoading(true);
    setData([]);
    getTicketPurchased(dataSearch, newPagination.current - 1, newPagination.pageSize)
      .then((response) => {
        const data = getDataApi(response);
        const total = data.totalElements;
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

  const handleTableChange = (newPagination, _, sorter) => {
    loadData(newPagination, sorter);
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

  const handleShowQr = (data) => {
    setDataTicketShowQr(data)
  }

  const handleCloseQr = () => {
    setDataTicketShowQr(null);
  }

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.createdTime = formatTimestamp(item.createdAt, "DD/MM/YYYY HH:mm:ss");
      item.expireTime = <div>
        <div>Từ: {formatTimestamp(item.startsValidity, "DD/MM/YYYY HH:mm:ss")}</div>
        <div>Đến: {formatTimestamp(item.expires, "DD/MM/YYYY HH:mm:ss")}</div>
      </div>
      item.statusPrint = <ButtonStatus 
      color={ticketPurchasedStatus[item.status].color} 
      label={ticketPurchasedStatus[item.status].label} />
      item.action = (
        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <Tooltip title="Chi tiết">
            <Link className="cb" to={"/ticket/detail/" + item.id}>
              <FaEye style={{ fontSize: 21, cursor: 'pointer' }} />
            </Link>
          </Tooltip>
          {(dataSearch.tab !== "4" && dataSearch.tab !== "3" && item.status === TICKET_PURCHASED_STATUS.BINH_THUONG.value) && <Tooltip title="Xem mã">
            <div onClick={() => { handleShowQr(item) }}>
              <LiaQrcodeSolid style={{ fontSize: 24, cursor: 'pointer' }} />
            </div>
          </Tooltip>}
        </div>
      );
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  return (
    <>
      <Table
        columns={baseColumns}
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
      />
      {dataTicketShowQr && <ModalCustom onClose={handleCloseQr}>
        <QrTicket data={dataTicketShowQr}/>
      </ModalCustom>}

    </>
  );
};

export default TableList;
