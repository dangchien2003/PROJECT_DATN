import { useState, useEffect } from "react";
import { Table } from "antd";
import ButtonStatus from "../ButtonStatus";
import { LOCATION_STATUS, MODIFY_STATUS, TICKET_STATUS } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useNavigate } from "react-router-dom";
import { showTotal } from "@/utils/table";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";
import { convertDataSort, getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { adminSearch } from "@/service/locationService";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Tên địa điểm",
    dataIndex: "locationNamePrint",
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
  }
];

const mapFieldSort = {
  locationNamePrint: "name",
  openDatePrint: "openDate",
}

const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.locationNamePrint = `${item.locationId} - ${item.name}`;
      const coordinates = JSON.parse(item?.coordinates)
      item.coordinatesPrint = <a href={item.linkGoogleMap}
      target="_blank" rel="noreferrer" onClick={(event)=> {event.stopPropagation()}}>{`[${coordinates?.x} x ${coordinates?.y}]`}</a>;
      item.openDatePrint = formatTimestamp(item.openDate, "DD/MM/YYYY")
      item.statusPrint = (
        <div>
          <div style={{ margin: 2 }}>
            <span>PH </span>
            <span>
              <ButtonStatus
                label={LOCATION_STATUS[item.status].label}
                color={LOCATION_STATUS[item.status].color}
              />
            </span>
          </div>
          <div style={{ margin: 2 }}>
            <span>TĐ </span>
            <span>
              <ButtonStatus
                label={MODIFY_STATUS[item.modifyStatus].label}
                color={MODIFY_STATUS[item.modifyStatus].color}
              />
            </span>
          </div>
        </div>
      );
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

const TableListLocation = ({dataSearch }) => {
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
  const [sorter] = useState({
    field: null,
    order: null,
  });

  const loadData = (newPagination, sorter) => {
    setLoading(true);
    setData([])
    adminSearch(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
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

  const handleClickRow = (data) => {
    navigate(`/location/detail/${dataSearch.tab}/${data.locationId}`)
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

export default TableListLocation;
