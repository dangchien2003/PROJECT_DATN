import ButtonStatus from "@/components/ButtonStatus";
import { useLoading } from "@/hook/loading";
import { linkTicket } from "@/service/cardService";
import { getTicketPurchased } from "@/service/ticketPurchasedService";
import { setSearching } from "@/store/startSearchSlice";
import { getDataApi } from "@/utils/api";
import { lineLoading, TICKET_PURCHASED_STATUS } from "@/utils/constants";
import { convertDataSelectboxToObject } from "@/utils/object";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError, toastSuccess } from "@/utils/toast";
import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaEye, FaLink } from "react-icons/fa6";
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
    title: "Địa điểm sử dụng",
    dataIndex: "location",
    key: "1.5",
    width: 250,
    align: "left"
  },
  {
    title: "Ngày mua",
    dataIndex: "createdTime",
    key: "2",
    width: 120,
    align: "center"
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "3",
    width: 120,
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
const TableList = ({ onLinkSuccess, cardId }) => {
  const { showLoad, hideLoad } = useLoading();
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

  const loadData = (newPagination) => {
    setLoading(true);
    setData([]);
    getTicketPurchased({ tab: 2 }, newPagination.current - 1, newPagination.pageSize)
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

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.location = <div style={{ width: 250 }}>
        <div className="truncated-text">{item.locationName}</div>
        <Tooltip title={item.address}>
          <div className="truncated-text gray">{item.address}</div>
        </Tooltip>
      </div>;
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
          <Tooltip title="Liên kết">
            <div onClick={() => { handleLink(item.id) }}>
              <FaLink style={{ fontSize: 21, cursor: 'pointer' }} />
            </div>
          </Tooltip>
        </div>
      );
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  const handleLink = (ticketId) => {
    showLoad(lineLoading);
    linkTicket(cardId, ticketId).then(response => {
      const data = getDataApi(response);
      onLinkSuccess(data);
      toastSuccess("Liên kết thành công");
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(hideLoad)
  }

  return (
    <>
      <Table
        columns={baseColumns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        tableLayout="fixed"
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
    </>
  );
};

export default TableList;
