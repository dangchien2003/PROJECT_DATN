import { useState, useEffect } from "react";
import { Table, Tooltip } from "antd";
import { fakeDataTable } from "./dataTest";
import ButtonStatus from "../ButtonStatus";
import { MODIFY_STATUS, TICKET_STATUS } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useLoading } from "@/utils/loading";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

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
    title: "Trạng thái",
    dataIndex: "statusPrint",
    key: "2",
    sorter: false,
    width: 120,
  },
  {
    title: "Ngày yêu cầu",
    dataIndex: "createdDate",
    key: "3.1",
    width: 120,
    sorter: true,
    align: "center"
  },
  {
    title: "Thời gian áp dụng",
    dataIndex: "timeAppliedEditPrint",
    key: "3",
    sorter: true,
    width: 120,
    align: "center"
  },
  {
    title: "Đối tác",
    dataIndex: "patnerName",
    key: "5",
    sorter: true,
    width: 120,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "6",
    fixed: "right",
    width: 120,
  }
];

const convertResponseToDataTable = (response, currentPage, pageSize) => {
  return response.data.map((item, index) => {
    item.ticketNamePrint = `${item.id} - ${item.name}`;
    item.createdDate = formatTimestamp(item.createdAt, "DD/MM/YYYY")
    item.timeAppliedEditPrint = formatTimestamp(item.timeAppliedEdit, "DD/MM/YYYY")
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
    item.action = (
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Tooltip title="Duyệt">
          <div>
            <FaRegCheckCircle style={{ color: "#00c49f", fontSize: 21, cursor: 'pointer' }} />
          </div>
        </Tooltip>
        <Tooltip title="Từ chối">
          <div>
            <MdOutlineCancel style={{ color: "#ff4d4f", fontSize: 24, cursor: 'pointer' }} />
          </div>
        </Tooltip>
      </div>
    );
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableListLocationWaitApprove = ({searchTimes, dataSearch }) => {
  // const navigate = useNavigate()
  const { showLoad, hideLoad } = useLoading();
  const [data, setData] = useState([]);
  const [columnsShow, setColumnsShow] = useState(columns);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState({
    field: "modifyId",
    order: "ascend",
  });

  useEffect(()=> {
    // ẩn cột khi vào tab từ chối
    if(dataSearch.type === 3) {
      const col = columns.filter(item => item.dataIndex !== "action" && item.dataIndex !== "statusPrint");
      setColumnsShow(col)
    }else {
      setColumnsShow(columns)
    }
  }, [dataSearch.type])

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
    // navigate(`/ticket/detail/0/${dataSearch.status === 0 ? 0 : 1}/${data.id}`)
  };

  useEffect(() => {
    loadData(pagination, sorter);
    console.log(dataSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTimes]);
  return (
    <Table
      columns={columnsShow}
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

export default TableListLocationWaitApprove;
