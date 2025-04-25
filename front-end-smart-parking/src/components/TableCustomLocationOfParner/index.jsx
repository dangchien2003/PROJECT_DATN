import { useState, useEffect } from "react";
import { Table } from "antd";
import { fakeDataTable } from "./dataTest";
import { formatTimestamp } from "@/utils/time";
import ButtonStatus from "../ButtonStatus";
import { LOCATION_STATUS, LOCALTION_MODIFY_STATUS } from "@/utils/constants";
import { showTotal } from "@/utils/table";
import { convertDataSelectboxToObject } from "@/utils/object";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 0,
  },
  {
    title: "Địa điểm",
    dataIndex: "namePrint",
    key: "1",
    sorter: false,
    width: 200,
  },
  {
    title: "Toạ độ",
    dataIndex: "coordinatesPrint",
    key: "2",
    sorter: false,
    align: "center",
    width: 120,
  },
  {
    title: "Sức chứa",
    dataIndex: "capacity",
    align: "center",
    key: "4",
    sorter: false,
    width: 120,
  },
];

const locaitonModifyStatus = convertDataSelectboxToObject(LOCALTION_MODIFY_STATUS);
const convertResponseToDataTable = (response, currentPage, pageSize) => {
  return response.data.map((item, index) => {
    item.namePrint = (
      <div>
        <div style={{ textAlign: "center" }}>{item.id}</div>
        <div>{`${item.name}`}</div>
      </div>
    );
    item.coordinatesPrint = (
      <div>
        <div>
          <>
            {item.modifyStatus !== null ? (
              <ButtonStatus
                label={locaitonModifyStatus[item.modifyStatus].label}
                color={locaitonModifyStatus[item.modifyStatus].color}
              />
            ) : (
              <ButtonStatus
                label={LOCATION_STATUS[item.status].label}
                color={LOCATION_STATUS[item.status].color}
              />
            )}
          </>
        </div>
        <div>
          <a
            href={item.linkGoogleMap}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.coordinates}
          </a>
        </div>
      </div>
    );
    item.buyTime = (
      <div>
        {formatTimestamp(item.createdAt, "DD/MM/YYYY")} <br />
        {formatTimestamp(item.createdAt, "HH:mm:ss")}
      </div>
    );
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomLocationOfParner = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState({
    field: "name",
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
    setData([]);
    setTimeout(() => {
      setLoading(false);
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

  useEffect(() => {
    loadData(pagination, sorter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        showTotal: showTotal,
      }}
    />
  );
};

export default TableCustomLocationOfParner;
