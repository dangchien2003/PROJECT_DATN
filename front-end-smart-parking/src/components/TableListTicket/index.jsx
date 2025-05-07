import { useState, useEffect } from "react";
import { Table } from "antd";
import ButtonStatus from "../ButtonStatus";
import { TICKET_MODIFY_STATUS, TICKET_STATUS, VEHICLE } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useNavigate } from "react-router-dom";
import { showTotal } from "@/utils/table";
import { convertDataSelectboxToObject } from "@/utils/object";
import { useDispatch, useSelector } from "react-redux";
import { adminSearch } from "@/service/ticketService";
import { toastError } from "@/utils/toast";
import { convertDataSort, getDataApi } from "@/utils/api";
import { setSearching } from "@/store/startSearchSlice";
import { isNullOrUndefined } from "@/utils/data";
import { formatCurrency } from "@/utils/number";
import Action from "./Action";

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
    dataIndex: "ticketNamePrint",
    key: "1",
    sorter: true,
    width: 150,
  },
  {
    title: "Đối tác",
    dataIndex: "partnerPrint",
    key: "1.1",
    sorter: false,
    width: 120,
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "2",
    sorter: false,
    width: 190,
  },
  {
    title: "Phương tiện",
    dataIndex: "vehiclePrint",
    key: "3",
    sorter: true,
    width: 120,
  },
  {
    title: "Thời điểm phát hành",
    dataIndex: "releaseTimePrint",
    key: "4",
    sorter: true,
    width: 120,
  },
  {
    title: "Thời điểm phát hành",
    dataIndex: "timeAppliedEditPrint",
    key: "4.5",
    sorter: true,
    width: 120,
  },
  {
    title: "Giá",
    dataIndex: "pricePrint",
    key: "5",
    width: 120,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    align: "center",
    key: "6",
    width: 200,
    fixed: "right",
  },
];

const ticketModifyStatus = convertDataSelectboxToObject(TICKET_MODIFY_STATUS);
const ticketStatus = convertDataSelectboxToObject(TICKET_STATUS);

const mapFieldSort = {
  vehiclePrint: "vehicle",
  ticketNamePrint: "name",
  releaseTimePrint: "releasedTime",
  timeAppliedEditPrint: "timeAppliedEdit"
}

const TableListTicket = ({ searchTimes, dataSearch }) => {
  const navigate = useNavigate()
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [columns, setColumns] = useState(baseColumns);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter] = useState({
    field: null,
    order: null,
  });

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.vehiclePrint = (
        <div>
          <span style={{ margin: "0 4px" }}>{VEHICLE[item.vehicle].icon}</span>
          {VEHICLE[item.vehicle].name}
        </div>
      );
      item.partnerPrint = (
        <div className="d-inline-block">
          {item.partnerId}<div style={{ textAlign: "center" }}>-</div>
          {item.partnerName}
        </div>
      );
      // đang áp dụng
      item.releaseTimePrint = (
        <div style={{ textAlign: "center" }}>
          {formatTimestamp(item.releaseTime, "DD/MM/YYYY")}
          <br />
          {formatTimestamp(item.releaseTime, "HH:mm")}
        </div>
      );
      // chờ áp dụng
      item.timeAppliedEditPrint = (
        <div style={{ textAlign: "center" }}>
          {formatTimestamp(item.timeAppliedEdit, "DD/MM/YYYY")}
          <br />
          {formatTimestamp(item.timeAppliedEdit, "HH:mm")}
        </div>
      );
      item.pricePrint = (
        <div>
          {item.timeSlot && <div>1 giờ: {formatCurrency(item.price.time?.price)} đ</div>}
          {item.daySlot && <div>1 ngày: {formatCurrency(item.price.day?.price)} đ</div>}
          {item.weekSlot && <div>1 tuần: {formatCurrency(item.price.week?.price)} đ</div>}
          {item.monthSlot && <div>1 tháng: {formatCurrency(item.price.month?.price)} đ</div>}
        </div>
      );
      item.statusPrint = (
        <div>
          <div style={{ margin: 2 }}>
            <span>PH </span>
            <span>
              <ButtonStatus
                label={ticketStatus[item.status].label}
                color={ticketStatus[item.status].color}
              />
            </span>
          </div>
          {/* đang phát hành hoặc tạm dừng phát hành */}
          {!isNullOrUndefined(item.modifyStatus)  && <div style={{ margin: 2 }}>
            <span>TĐ </span>
            <span>
              <ButtonStatus
                label={ticketModifyStatus[item.modifyStatus].label}
                color={ticketModifyStatus[item.modifyStatus].color}
              />
            </span>
          </div>
          }
          {/* từ chối/huỷ phát hành */}
          {dataSearch.tab === 4 && <div style={{ margin: 2 }}>
            <span>TĐ </span>
            <span>
              <ButtonStatus
                label={!isNullOrUndefined(item.reasonReject) ? "Bị từ chối" : "Đã huỷ"}
                color={"danger"}
              />
            </span>
          </div>
          }
        </div>
      );
      const id = !isNullOrUndefined(item.id) ? item.id : item.ticketId;
      item.ticketNamePrint = `${id} - ${item.name}`;
      if (dataSearch.tab === 1) {
        item.action = <Action data={item} dataList={data} handleConvert={convertResponseToDataTable} />
      }
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  const loadData = (newPagination, sorter) => {
    setLoading(true);
    setData([])
    adminSearch(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
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
    convertDataSort(sorter, mapFieldSort)
    loadData(newPagination, sorter);
  };

  const handleClickRow = (data) => {
    navigate(`/ticket/detail/${dataSearch.tab === 5 ? 1 : 0}/${dataSearch.tab}/${data.id}`)
  };

  const showColumn = () => {
    if (dataSearch.tab === 2 || dataSearch.tab === 3) {
      setColumns(baseColumns.filter(item => item.dataIndex !== "action" && item.dataIndex !== "timeAppliedEditPrint"));
    } else if(dataSearch.tab === 4) {
      setColumns(baseColumns.filter(item => item.dataIndex !== "timeAppliedEditPrint"))
    }else {
      setColumns(baseColumns.filter(item => item.dataIndex !== "releaseTimePrint"))
    }
  }

  useEffect(() => {
    showColumn();
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

export default TableListTicket;
