import { getTicketOfPartner } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import { TICKET_STATUS, VEHICLE } from "@/utils/constants";
import { convertDataSelectboxToObject } from "@/utils/object";
import { showTotal } from "@/utils/table";
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
    width: 1,
  },
  {
    title: "Tên vé",
    dataIndex: "ticketNamePrint",
    key: "1",
    sorter: false,
    width: 150,
  },
  {
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "2",
    sorter: false,
    width: 120,
  },
  {
    title: "Phương tiện",
    dataIndex: "vehiclePrint",
    key: "3",
    sorter: false,
    width: 120,
  },
  {
    title: "Địa điểm",
    dataIndex: "countLocationUse",
    align: "center",
    key: "4",
    sorter: false,
    width: 120,
  },
];

const ticketStatus = convertDataSelectboxToObject(TICKET_STATUS);
const convertResponseToDataTable = (data, currentPage, pageSize) => {
  return data.map((item, index) => {
    item.vehiclePrint = (
      <div>
        <span style={{ margin: "0 4px" }}>{VEHICLE[item.vehicle].icon}</span>
        {VEHICLE[item.vehicle].name}
      </div>
    );
    item.statusPrint = (
      <>
        <ButtonStatus
          label={ticketStatus[item.status].label}
          color={ticketStatus[item.status].color}
        />
      </>
    );
    item.ticketNamePrint = `${item.ticketId} - ${item.name}`;
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomTicketOfPartner = ({ accountId }) => {
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
    getTicketOfPartner(accountId, newPagination.current - 1, newPagination.pageSize)
      .then((response) => {
        const result = getDataApi(response);
        const total = result?.totalElements;
        setData(
          convertResponseToDataTable(
            result.data,
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

  const handleClickRow = (record) => {
    navigate(`/admin/ticket/detail/0/${record.ticketId}`)
  }
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

export default TableCustomTicketOfPartner;
