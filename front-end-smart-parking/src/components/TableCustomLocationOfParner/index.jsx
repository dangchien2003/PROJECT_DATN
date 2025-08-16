import { getLocationOfPartner } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import { LOCATION_STATUS } from "@/utils/constants";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table } from "antd";
import { useEffect, useState } from "react";
import ButtonStatus from "../ButtonStatus";
import { useNavigate } from "react-router-dom";

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

const convertResponseToDataTable = (data, currentPage, pageSize) => {
  return data.map((item, index) => {
    item.namePrint = (
      <div>{`${item.locationId} - ${item.name}`}</div>
    );
    item.coordinatesPrint = (
      <div>
        <div>
          <ButtonStatus
            label={LOCATION_STATUS[item.status].label}
            color={LOCATION_STATUS[item.status].color}
          />
        </div>
        <div>
          <a
            href={item.linkGoogleMap}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.coordinatesX ? `${item.coordinatesX} x ${item.coordinatesY}` : "Không có tọa độ"}
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

const TableCustomLocationOfParner = ({ partnerId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadData = (newPagination) => {
    setLoading(true);
    setData([])
    getLocationOfPartner(partnerId, newPagination.current - 1, newPagination.pageSize)
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
      });
  };

  const handleTableChange = (newPagination, _, sorter) => {
    setPagination(newPagination);
    loadData(newPagination, sorter);
  };

  useEffect(() => {
    loadData(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickRow = (data) => {
    navigate(`/admin/location/detail/1/${data.locationId}`)
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

export default TableCustomLocationOfParner;
