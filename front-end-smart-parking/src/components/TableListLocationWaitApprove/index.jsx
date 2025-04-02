import { useState, useEffect } from "react";
import { Table, Tooltip } from "antd";
import { fakeDataTable } from "./dataTest";
import ButtonStatus from "../ButtonStatus";
import { MODIFY_STATUS, TICKET_STATUS } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useLoading } from "@/hook/loading";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PopConfirmCustom from "../PopConfirmCustom";

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



const TableListLocationWaitApprove = ({searchTimes, dataSearch }) => {
  const navigate = useNavigate()
  const { showLoad, hideLoad } = useLoading();
  const [data, setData] = useState([]);
  const [columnsShow, setColumnsShow] = useState(columns);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [dataAction, setDataAction] = useState(null);
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
    console.log(dataSearch.tab)
    // ẩn cột khi vào tab từ chối
    if(dataSearch.tab === 5) {
      const col = columns.filter(item => item.dataIndex !== "action" && item.dataIndex !== "statusPrint");
      setColumnsShow(col)
    }else {
      setColumnsShow(columns)
    }
  }, [dataSearch.tab])

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
    navigate(`/location/detail/${dataSearch.tab}/${data.id}`)
  };

  useEffect(() => {
    loadData(pagination, sorter);
    console.log(dataSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTimes]);
  
  const resetAction = () => {
    setAction(null);
    setDataAction(null);
  }

  const handleAllowApprove = () => {
    console.log("đồng ý duyệt")
    showLoad("Đang xử lý");
    setTimeout(()=> {
      hideLoad();
      resetAction();
    }, 3000)
  }

  const handleCancelApprove = () => {
    console.log("huỷ việc duyệt")
    resetAction();
  }

  const handleAllowReject = () => {
    console.log("đồng ý từ chối")
    showLoad("Đang xử lý");
    setTimeout(()=> {
      hideLoad();
      resetAction();
    }, 3000)
  }

  const handleCancelReject = () => {
    console.log("huỷ việc từ chối")
    console.log(dataAction)
    resetAction();
  }


  const handleConfirm = (event, action, data) => {
    setAction(action);
    setDataAction(data)
    event.stopPropagation();
  }

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
            <div onClick={(event)=> {handleConfirm(event, 1, item)}}>
              <FaRegCheckCircle style={{ color: "#00c49f", fontSize: 21, cursor: 'pointer' }} />
            </div>
          </Tooltip>
          <Tooltip title="Từ chối">
            <div onClick={(event)=> {handleConfirm(event, 2, item)}}>
              <MdOutlineCancel style={{ color: "#ff4d4f", fontSize: 24, cursor: 'pointer' }} />
            </div>
          </Tooltip>
        </div>
      );
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  const getMessagePopup = (action) => {
    if(dataSearch.tab === 3) {
      if(action === 1) {
        return {
          title: 'Bạn có chắc chắn đồng ý việc thêm địa điểm "EAON MALL Hà Đông" của đối tác "EAON MALL" không?',
          message: "Địa điểm sẽ đi vào hoạt động vào 20/12/2025 11:11"
        }
      }else if(action === 2) {
        return {
          title: 'Bạn có chắc chắn từ chối việc thêm địa điểm "EAON MALL Hà Đông" của đối tác "EAON MALL" không?',
          message: "Yêu cầu sẽ chuyển sang trạng thái bị từ chối"
        }
      }
    }else if (dataSearch.tab === 4){
      if(action === 1) {
        return {
          title: 'Bạn có chắc chắn đồng ý việc sửa thông tin địa điểm "EAON MALL Hà Đông" của đối tác "EAON MALL" không?',
          message: "Thông tin chỉnh sửa sẽ được áp dụng vào 20/12/2025 11:11"
        }
      }else if(action === 2) {
        return {
          title: 'Bạn có chắc chắn từ chối việc sửa thông tin địa điểm "EAON MALL Hà Đông" của đối tác "EAON MALL" không?',
          message: "Yêu cầu sẽ chuyển sang trạng thái bị từ chối"
        }
      }
    }

    return {}
  }
  return (
    <>
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
      {action === 1 && <PopConfirmCustom type="warning" {...getMessagePopup(1)} handleOk={handleAllowApprove} handleCancel={handleCancelApprove} key={"approve"}/>}
      {action === 2 && <PopConfirmCustom type="warning" {...getMessagePopup(2)} handleOk={handleAllowReject} handleCancel={handleCancelReject} key={"reject"}/>}
    </>
  );
};

export default TableListLocationWaitApprove;
