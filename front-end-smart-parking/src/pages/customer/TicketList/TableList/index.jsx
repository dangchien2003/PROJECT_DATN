import { useState, useEffect } from "react";
import { Table, Tooltip } from "antd";
import { TICKET_PURCHASED_STATUS } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { convertDataSort } from "@/utils/api";
import { setSearching } from "@/store/startSearchSlice";
import { showTotal } from "@/utils/table";
import { convertDataSelectboxToObject } from "@/utils/object";
import { dataResponse } from "./fakedata";
import { FaEye } from "react-icons/fa6";
import { LiaQrcodeSolid } from "react-icons/lia";
import ButtonStatus from "@/components/ButtonStatus";
import ModalCustom from "@/components/ModalCustom";
import QrTicket from "@/components/QrTicket";

const baseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Tên vé",
    dataIndex: "name",
    key: "1",
    sorter: true,
    width: 200,
  },
  {
    title: "Ngày mua",
    dataIndex: "createdTime",
    key: "2",
    sorter: true,
    width: 120,
    align: "center"
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "3",
    width: 120,
    sorter: true,
    align: "left"
  },
  {
    title: "Hạn sử dụng",
    dataIndex: "expireTime",
    key: "4",
    sorter: false,
    width: 120,
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

const mapFieldSort = {
  createdDate: "createdAt",
  timeAppliedEditPrint: "timeAppliedEdit",
  namePrint: "name",
}

const ticketPurchasedStatus = convertDataSelectboxToObject(TICKET_PURCHASED_STATUS);
const TableList = ({ dataSearch }) => {
  const navigate = useNavigate()
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(baseColumns);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [dataTicketShowQr, setDataTicketShowQr] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter] = useState({
    field: null,
    order: null,
  });

  useEffect(() => {
    console.log(dataSearch)
  }, [dataSearch.tab])

  const loadData = (newPagination, sorter) => {
    setLoading(true);
    setData([])

    setTimeout(() => {
      const data = dataResponse.data;
      const total = dataResponse.totalElements;
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
      setLoading();
      dispatch(setSearching(false));
    }, 1000)

    // adminSearchWaitApprove(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
    //   .then((response) => {
    //     const data = getDataApi(response);
    //     const total = response.data?.result?.totalElements;
    //     setData(
    //       convertResponseToDataTable(
    //         data,
    //         newPagination.current,
    //         newPagination.pageSize
    //       )
    //     );
    //     setPagination({
    //       ...newPagination,
    //       total: total,
    //     });
    //   })
    //   .catch((error) => {
    //     error = getDataApi(error);
    //     toastError(error.message)
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //     dispatch(setSearching(false))
    //   });
  };

  const handleTableChange = (newPagination, _, sorter) => {
    convertDataSort(sorter, mapFieldSort)
    loadData(newPagination, sorter);
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

  const handleDetail = (data) => {

  }

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
      item.statusPrint = <ButtonStatus color={ticketPurchasedStatus[item.status].color} label={ticketPurchasedStatus[item.status].label} />
      item.action = (
        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <Tooltip title="Chi tiết">
            <div onClick={() => { handleDetail(item) }}>
              <FaEye style={{ fontSize: 21, cursor: 'pointer' }} />
            </div>
          </Tooltip>
          {(dataSearch.tab !== 4 && dataSearch.tab !== 3) && <Tooltip title="Xem mã">
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
      />
      {dataTicketShowQr && <ModalCustom onClose={handleCloseQr}>
        <QrTicket data={dataTicketShowQr}/>
      </ModalCustom>}

    </>
  );
};

export default TableList;
