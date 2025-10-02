import { historyCheckingByAdmin } from "@/service/accountService";
import { getDataApi } from "@/utils/api";
import { showTotal } from "@/utils/table";
import { convertToTime, formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import ButtonStatus from "../ButtonStatus";
import dayjs from 'dayjs'
import { FaEye } from "react-icons/fa6";
import ModalCustom from "../ModalCustom";
import DetailHistory from "@/pages/admin/AccountCustomerInfo/DetailHistory";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "checkin",
    dataIndex: "checkin",
    key: "1",
    sorter: false,
    width: 100,
  },
  {
    title: "checkout",
    dataIndex: "checkout",
    key: "2",
    sorter: false,
    width: 100,
  },
  {
    title: "Tổng thời gian",
    dataIndex: "total",
    key: "3",
    sorter: false,
    width: 100,
  },
  {
    title: "Địa điểm",
    dataIndex: "locationName",
    key: "4",
    sorter: false,
    width: 200,
  },
  {
    title: "Chi tiết",
    dataIndex: "action",
    key: "5",
    align: "center",
    fixed: "right",
    width: 100,
  },
];

const TableCustomHistoryInOut = ({ accountId }) => {
  const [detailId, setDetailId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.checkin = (
        <>
          {formatTimestamp(item.checkinAt, "DD/MM/YYYY")}
          <br />
          {formatTimestamp(item.checkinAt, "HH:mm:ss")}
        </>
      );
      console.log(item.checkoutAt)
      if (item.checkoutAt) {
        item.checkout = (
          <>
            {formatTimestamp(item.checkoutAt, "DD/MM/YYYY")}
            <br />
            {formatTimestamp(item.checkoutAt, "HH:mm:ss")}
          </>
        );
        item.total = <>
          <ButtonStatus label="Kết thúc" color="cyan" />
          <br />
          {convertToTime(dayjs(item.checkoutAt).diff(dayjs(item.checkinAt)))}
        </>;
      } else {
        item.total = (
          <>
            <ButtonStatus label="Đang gửi" color="warning" />
            <br />
            {convertToTime(dayjs().diff(dayjs(item.checkinAt)))}
          </>
        );
      }
      item.action = (
        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <Tooltip title="Chi tiết">
            <div onClick={() => setDetailId(item.id)}>
              <FaEye style={{ fontSize: 21, cursor: 'pointer' }} />
            </div>
          </Tooltip>
        </div>
      );
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  const loadData = (newPagination) => {
    setLoading(true);
    setData([]);
    historyCheckingByAdmin(accountId, newPagination.current - 1, newPagination.pageSize).then((response) => {
      const result = getDataApi(response);
      setData(
        convertResponseToDataTable(
          result.data,
          newPagination.current,
          newPagination.pageSize
        )
      );
      setPagination({
        ...newPagination,
        total: result.totalElements,
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

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    loadData(newPagination);
  };

  useEffect(() => {
    if (accountId == null) {
      return;
    }
    loadData(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  return (
    <>
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
      {detailId && <ModalCustom onClose={() => setDetailId(null)}>
        <DetailHistory id={detailId}/>
      </ModalCustom>}
    </>
  );
};

export default TableCustomHistoryInOut;
