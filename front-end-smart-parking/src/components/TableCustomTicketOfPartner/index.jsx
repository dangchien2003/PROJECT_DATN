import { useState, useEffect } from "react";
import { Table } from "antd";
import { fakeDataTable } from "./dataTest";
import ButtonStatus from "../ButtonStatus";
import { TICKET_MODIFY_STATUS, TICKET_STATUS, VEHICLE } from "@/utils/constants";
import { showTotal } from "@/utils/table";
import { convertDataSelectboxToObject } from "@/utils/object";

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
    dataIndex: "locationCount",
    align: "center",
    key: "4",
    sorter: false,
    width: 120,
  },
];

const ticketModifyStatus = convertDataSelectboxToObject(TICKET_MODIFY_STATUS);
const ticketStatus = convertDataSelectboxToObject(TICKET_STATUS);
const convertResponseToDataTable = (response, currentPage, pageSize) => {
  return response.data.map((item, index) => {
    item.vehiclePrint = (
      <div>
        <span style={{ margin: "0 4px" }}>{VEHICLE[item.vehicle].icon}</span>
        {VEHICLE[item.vehicle].name}
      </div>
    );
    item.statusPrint = (
      <>
        {item.modifyStatus !== 0 ? (
          <ButtonStatus
            label={ticketModifyStatus[item.modifyStatus].label}
            color={ticketModifyStatus[item.modifyStatus].color}
          />
        ) : (
          <ButtonStatus
            label={ticketStatus[item.status].label}
            color={ticketStatus[item.status].color}
          />
        )}
      </>
    );
    item.ticketNamePrint = `${item.id} - ${item.name}`;
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomTicketOfPartner = () => {
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

export default TableCustomTicketOfPartner;
