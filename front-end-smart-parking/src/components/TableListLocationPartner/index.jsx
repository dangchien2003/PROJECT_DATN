import { useState, useEffect } from "react";
import { Table } from "antd";
import ButtonStatus from "../ButtonStatus";
import { LOCATION_STATUS, MODIFY_STATUS, TICKET_STATUS } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { partnerSearch } from "@/service/locationService";
import { convertDataSort, getDataApi } from "@/utils/api";
import { setSearching } from "@/store/startSearchSlice";
import { toastError } from "@/utils/toast";
import { tab } from "@testing-library/user-event/dist/tab";

const BaseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Tên địa điểm",
    dataIndex: "name",
    key: "1",
    sorter: false,
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
];

const mapFieldSort = {
  openDatePrint: "openDate",
}

const TableListLocationPartner = ({dataSearch }) => {
  const navigate = useNavigate()
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(BaseColumns);
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
    if(![3, 4].includes(dataSearch.tab) ) {
     newColumns = [...BaseColumns].filter((item) => item.key !== "6");
    }else {
      newColumns = [...BaseColumns];
    }
    setColumns(newColumns);
  }, [dataSearch.tab])

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.coordinatesPrint = <a href={item.linkGoogleMap}
      target="_blank" rel="noreferrer" onClick={(event)=> {event.stopPropagation()}}>{item.coordinates && `[${item.coordinates?.x}x${item.coordinates?.y}]`}</a>;
      item.openDatePrint = formatTimestamp(item.openDate, "DD/MM/YYYY")
      item.openDatePrint = formatTimestamp(item.openDate, "DD/MM/YYYY")
      item.statusPrint = (
        <div>
          <div style={{ margin: 2 }}>
            <span>PH </span>
            <span>
              {item.modifyStatus !== null ? (
                <ButtonStatus
                  label={LOCATION_STATUS[item.status].label}
                  color={LOCATION_STATUS[item.status].color}
                />
              ) : (
                <ButtonStatus
                  label={MODIFY_STATUS[item.modifyStatus].label}
                  color={MODIFY_STATUS[item.modifyStatus].color}
                />
              )}
            </span>
          </div>
          {tab === 3 || tab === 4 && <div style={{ margin: 2 }}>
            <span>TĐ </span>
            <span>
              {item.modifyStatus !== null ? (
                <ButtonStatus
                  label={MODIFY_STATUS[item.modifyStatus].label}
                  color={MODIFY_STATUS[item.modifyStatus].color}
                />
              ) : (
                <ButtonStatus
                  label={TICKET_STATUS[item.status].label}
                  color={TICKET_STATUS[item.status].color}
                />
              )}
            </span>
          </div>}
        </div>
      );
      if(dataSearch.tab === 3 || dataSearch.tab === 4) {
        item.categoryPrint = item.locationId ? "Chỉnh sửa": "Thêm mới";
      }
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  const loadData = (newPagination, sorter) => {
    setLoading(true);
    partnerSearch(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
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
    convertDataSort(sorter, mapFieldSort)
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
    navigate(`/partner/location/detail/${dataSearch.tab}/${data.id}`)
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

export default TableListLocationPartner;
