import { useState, useEffect } from "react";
import { Table } from "antd";
import ButtonStatus from "../ButtonStatus";
import { LOCATION_STATUS, LOCALTION_MODIFY_STATUS } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { partnerSearch } from "@/service/locationService";
import { convertDataSort, getDataApi } from "@/utils/api";
import { setSearching } from "@/store/startSearchSlice";
import { toastError } from "@/utils/toast";
import { showTotal } from "@/utils/table";
import dayjs from "dayjs";
import { convertDataSelectboxToObject } from "@/utils/object";

const baseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Tên địa điểm",
    dataIndex: "namePrint",
    key: "1",
    sorter: true,
    width: 150,
  },
  {
    title: "Toạ độ",
    dataIndex: "coordinatesPrint",
    key: "2",
    sorter: false,
    width: 120,
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "3",
    sorter: false,
    width: 120,
  },
  {
    title: "Ngày mở cửa",
    dataIndex: "openDatePrint",
    key: "4",
    sorter: true,
    width: 120,
    align: "center"
  },
  {
    title: "Sức chứa",
    dataIndex: "capacity",
    key: "5",
    sorter: true,
    width: 120,
    align: "center"
  },
  {
    title: "Phân loại",
    dataIndex: "categoryPrint",
    key: "6",
    sorter: false,
    width: 150,
  },
  {
    title: "Thời điểm áp dụng",
    dataIndex: "applyTime",
    key: "7",
    sorter: false,
    width: 150,
  },
];

const mapFieldSort = {
  openDatePrint: "openDate",
}

const locaitonModifyStatus = convertDataSelectboxToObject(LOCALTION_MODIFY_STATUS);
const TableListLocationPartner = ({ dataSearch }) => {
  const navigate = useNavigate()
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(baseColumns);
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

  useEffect(() => {
    let newColumns;
    if (dataSearch.tab === 5) {
      // chờ áp dụng
      newColumns = [...baseColumns].filter((item) => item.key !== "6");;
    } else if (![3, 4].includes(dataSearch.tab)) {
      // đang hd và dừng hđ
      newColumns = [...baseColumns].filter((item) => item.key !== "6" && item.key !== "7");
    } else {
      // chờ duyệt và từ chối
      newColumns = [...baseColumns].filter((item) => item.key !== "7");
    }
    setColumns(newColumns);
  }, [dataSearch.tab])

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      var idShow = item.locationId;
      if(dataSearch.tab === 3 || dataSearch.tab === 4) {
        idShow = item.modifyId;
      } else if(dataSearch.tab === 5) {
        idShow = item.id;
      }
      item.namePrint = `${idShow} - ${item.name}`;
      item.coordinatesPrint = <a href={item.linkGoogleMap}
        target="_blank" rel="noreferrer" onClick={(event) => { event.stopPropagation() }}>{item.coordinates && `[${item.coordinates?.x}x${item.coordinates?.y}]`}</a>;
      item.openDatePrint = formatTimestamp(item.openDate, "DD/MM/YYYY")
      const now = dayjs()
      const openDate = dayjs(item.openDate)
      item.statusPrint = (
        <div>
          <div style={{ margin: 2 }}>
            <span>PH </span>
            <span>
              <ButtonStatus
                label={item.status !== 1 ? LOCATION_STATUS[item.status].label : (openDate.isBefore(now) ? LOCATION_STATUS[item.status].label : "Đã duyệt")}
                color={LOCATION_STATUS[item.status]?.color}
              />
            </span>
          </div>
          <div style={{ margin: 2 }}>
            <span>TĐ </span>
            <span>
              <ButtonStatus
                label={locaitonModifyStatus[item.modifyStatus]?.label}
                color={locaitonModifyStatus[item.modifyStatus]?.color}
              />
            </span>
          </div>
        </div>
      );
      if (dataSearch.tab === 3 || dataSearch.tab === 4 || dataSearch.tab === 5) {
        item.categoryPrint = item.locationId ? "Chỉnh sửa" : "Thêm mới";
      }
      if(dataSearch.tab === 5) {
        item.applyTime = item.timeAppliedEdit ? formatTimestamp(item.timeAppliedEdit, "DD/MM/YYYY HH:mm") : null;
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

  useEffect(() => {
    if (isSearching || !firstSearch) {
      loadData(pagination, sorter);
      if (!firstSearch) {
        setFirstSearch(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching]);

  const handleClickRow = (data) => {
    let id = data.locationId;
    if(dataSearch.tab === 3 || dataSearch.tab === 4) {
      id = data.modifyId;
    } else if(dataSearch.tab === 5) {
      id = data.id;
    }
    navigate(`/partner/location/detail/${dataSearch.tab}/${id}`)
  };
  return (
    <Table
      columns={columns}
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
      onRow={(record) => {
        return {
          onClick: () => handleClickRow(record),
        };
      }}
    />
  );
};

export default TableListLocationPartner;
