import { useState, useEffect } from "react";
import { Table } from "antd";
import { fakeDataTable } from "./dataTest";
import ButtonStatus from "../ButtonStatus";
import { MODIFY_STATUS, TICKET_STATUS } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useLoading } from "@/hook/loading";
import { useNavigate } from "react-router-dom";
import { showTotal } from "@/utils/table";

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
    dataIndex: "ticketNamePrint",
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
  }
];

const convertResponseToDataTable = (response, currentPage, pageSize) => {
    return response.data.map((item, index) => {
      item.ticketNamePrint = `${item.id} - ${item.name}`;
      item.coordinatesPrint = <a href={item.linkGoogleMap}
      target="_blank" rel="noreferrer" onClick={(event)=> {event.stopPropagation()}}>[{item.coordinates}]</a>;
      item.openDatePrint = formatTimestamp(item.openDate, "DD/MM/YYYY")
      item.statusPrint = (
        <div>
          <div style={{ margin: 2 }}>
            <span>PH </span>
            <span>
              {item.modifyStatus !== null ? (
                <ButtonStatus
                  label={MODIFY_STATUS[item.status].label}
                  color={MODIFY_STATUS[item.modifyStatus].color}
                />
              ) : (
                <ButtonStatus
                  label={TICKET_STATUS[item.status].label}
                  color={TICKET_STATUS[item.status].color}
                />
              )}
            </span>
          </div>
          <div style={{ margin: 2 }}>
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
          </div>
        </div>
      );
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

const TableListLocation = ({searchTimes, dataSearch }) => {
  const navigate = useNavigate()
  const { showLoad, hideLoad } = useLoading();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState({
    field: "id",
    order: "ascend",
  });

  const loadData = (newPagination, sorter) => {
    if (!sorter.field || !sorter.order) {
      sorter = {
        field: "name",
        order: "ascend",
      };
      setSorter(sorter);
    }
    setLoading(true);
    if (searchTimes > 0) {
      showLoad();
    }
    setTimeout(() => {
      setLoading(false);
      hideLoad();
      const dataResponse = {
        data: fakeDataTable,
        totalElement: 60,
        totalPage: 10,
      };
      setData(
        convertResponseToDataTable(
          dataResponse,
          newPagination.current,
          newPagination.pageSize
        )
      );
      setPagination({
        ...newPagination,
        total: dataResponse.totalElement,
      });
    }, 1000);
  };

  const handleTableChange = (newPagination, _, sorter) => {
    setPagination(newPagination);
    loadData(newPagination, sorter);
  };

  const handleClickRow = (data) => {
    navigate(`/partner/location/detail/${dataSearch.tab}/${data.id}`)
  };

  useEffect(() => {
    loadData(pagination, sorter);
    console.log(dataSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTimes]);
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
