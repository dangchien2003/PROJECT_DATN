import { useState, useEffect } from "react";
import { Table } from "antd";
import ButtonStatus from "../ButtonStatus";
import { TICKET_MODIFY_STATUS, TICKET_STATUS, VEHICLE } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useNavigate } from "react-router-dom";
import { showTotal } from "@/utils/table";
import { convertDataSelectboxToObject } from "@/utils/object";
import { useDispatch, useSelector } from "react-redux";
import { partnerSearch } from "@/service/ticketService";
import { setSearching } from "@/store/startSearchSlice";
import { toastError } from "@/utils/toast";
import { convertDataSort, getDataApi } from "@/utils/api";
import { isNullOrUndefined } from "@/utils/data";
import { formatCurrency } from "@/utils/number";
import "./style.css"
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
    dataIndex: "releasedTimePrint",
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

const mapFieldSort = {
  releasedTimePrint: "releasedTime",
  ticketNamePrint: "name",
  vehiclePrint: "vehicle"
}
// dữ liệu trạng thái
const ticketModifyStatus = convertDataSelectboxToObject(TICKET_MODIFY_STATUS);
const ticketStatus = convertDataSelectboxToObject(TICKET_STATUS);
const TableListTicketPartner = ({ dataSearch }) => {
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


  const convertResponseToDataTable = (result, currentPage, pageSize) => {
    return result.map((item, index) => {
      item.vehiclePrint = (
        <div>
          <span style={{ margin: "0 4px" }}>{VEHICLE[item.vehicle].icon}</span>
          {VEHICLE[item.vehicle].name}
        </div>
      );
      item.releasedTimePrint = (
        <div style={{ textAlign: "center" }}>
          {formatTimestamp(item.releasedTime, "DD/MM/YYYY")}
          <br />
          {formatTimestamp(item.releasedTime, "HH:mm")}
        </div>
      );
      item.timeAppliedEditPrint = (
        <div style={{ textAlign: "center" }}>
          {formatTimestamp(item.timeAppliedEdit, "DD/MM/YYYY")}
          <br />
          {formatTimestamp(item.timeAppliedEdit, "HH:mm")}
        </div>
      );
      item.pricePrint = (
        <div>
          {item.timeSlot && <div key="time">1 giờ: {formatCurrency(item.price.time?.price)} đ</div>}
          {item.daySlot && <div key="day">1 ngày: {formatCurrency(item.price.day?.price)} đ</div>}
          {item.weekSlot && <div key="week">1 tuần: {formatCurrency(item.price.week?.price)} đ</div>}
          {item.monthSlot && <div key="month">1 tháng: {formatCurrency(item.price.month?.price)} đ</div>}
        </div>
      );
      item.statusPrint = (
        <div>
          <div style={{ margin: 2 }}>
            <span>PH </span>
            <span>
              {
                <ButtonStatus
                  label={ticketStatus[item.status].label}
                  color={ticketStatus[item.status]?.color}
                />
              }
            </span>
          </div>
          <div style={{ margin: 2 }}>
            {(item.isDel) && <>
              <span>TĐ </span>
              <span>
                {
                  <ButtonStatus
                    label={isNullOrUndefined(item.reasonReject) ? "Đã huỷ" : "Bị từ chối"}
                    color={"danger"}
                  />
                }
              </span>
            </>}
          </div>
          {(!isNullOrUndefined(item.modifyStatus)) && <>
            <span>TĐ </span>
            <span>
              {
                <ButtonStatus
                  label={ticketModifyStatus[item.modifyStatus]?.label}
                  color={ticketModifyStatus[item.modifyStatus]?.color}
                />
              }
            </span>
          </>}
        </div>
      );
      let id = item.ticketId;
      if (item.id) {
        id = item.id
      }
      item.ticketNamePrint = `${id} - ${item.name}`;
      if (dataSearch.tab === 3) {
        item.action = <Action data={item} dataList={data} handleConvert={convertResponseToDataTable} />
      }
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  const loadData = (newPagination, sorter) => {
    setLoading(true);
    setData([])
    partnerSearch(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
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

  const handleTableChange = (newPagination, _, sorter) => {
    convertDataSort(sorter, mapFieldSort)
    loadData(newPagination, sorter);
  };

  const handleClickRow = (data) => {
    let id = null;
    let isWaitRelease = 0;
    if (data.id) {
      id = data.id;
      isWaitRelease = 1;
    }
    else if (data.ticketId) {
      id = data.ticketId;
      isWaitRelease = 0;
    }
    navigate(`/partner/ticket/detail/${isWaitRelease}/${id}`)
  };

  const showColumn = () => {
    if (dataSearch.tab === 1) {
      setColumns(baseColumns.filter(item => item.dataIndex !== "action" && item.dataIndex !== "timeAppliedEditPrint"))
    } else {
      setColumns(baseColumns.filter(item => item.dataIndex !== "releasedTimePrint"))
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

export default TableListTicketPartner;
