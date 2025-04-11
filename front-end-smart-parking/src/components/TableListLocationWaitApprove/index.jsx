import { useState, useEffect } from "react";
import { Table, Tooltip } from "antd";
import ButtonStatus from "../ButtonStatus";
import { LOCATION_STATUS, MODIFY_STATUS } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useLoading } from "@/hook/loading";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PopConfirmCustom from "../PopConfirmCustom";
import { useDispatch, useSelector } from "react-redux";
import { adminSearchWaitApprove, approve } from "@/service/locationService";
import { convertDataSort, getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { setSearching } from "@/store/startSearchSlice";
import { showTotal } from "@/utils/table";
import MessageReject from "../MessageReject";
import { useMessageError } from "@/hook/validate";

const baseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Tên địa điểm",
    dataIndex: "namePrint",
    key: "1",
    sorter: true,
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
    dataIndex: "partnerFullName",
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

const mapFieldSort = {
  createdDate: "createdAt",
  timeAppliedEditPrint: "timeAppliedEdit",
  namePrint: "name",
}
const resonReject = {
  value: null
};
const TableListLocationWaitApprove = ({dataSearch }) => {
  const navigate = useNavigate()
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(baseColumns);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [action, setAction] = useState(null);
  const [dataAction, setDataAction] = useState(null);
  const { showLoad, hideLoad } = useLoading();
  const {pushMessage, deleteKey} = useMessageError();
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
    if(dataSearch.tab === 5) {
     newColumns = [...baseColumns].filter((item) => item.key !== "6");
    }else {
      newColumns = [...baseColumns];
    }
    setColumns(newColumns);
  }, [dataSearch.tab])

  const loadData = (newPagination, sorter) => {
    setLoading(true);
    setData([])
    adminSearchWaitApprove(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
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
    navigate(`/location/detail/${dataSearch.tab}/${data.id}`)
  };
  
  const resetAction = () => {
    setAction(null);
    setDataAction(null);
  }

  const handleAllowApprove = () => {
    const payload  = {
      id: dataAction.modifyId,
      approve: true,
    }
    showLoad("Đang xử lý");
    processAction(payload);
  }

  const handleCancelApprove = () => {
    resetAction();
  }

  const handleAllowReject = () => {
    const payload  = {
      id: dataAction.modifyId,
      approve: false,
      reason: resonReject.value,
    };
    // không thực thi khi không có lý do
    if(!resonReject.value || resonReject.value === "") {
      pushMessage("reasonReject", "Vui lòng nhập lý do từ chối")
      return
    }
    showLoad("Đang xử lý");
    processAction(payload);
  }

  const processAction = (payload)=> {
    approve(payload)
    .then((response) => {
      const dataResponse = getDataApi(response);
      if(dataResponse.code === 1000) {
        const newData = [...data].filter(item => item.modifyId !== dataAction.modifyId);
        console.log(newData)
        setData(newData);
        setPagination({
          ...pagination,
          total: pagination.total - 1,
        });
      }
    })
    .catch((error) => {
      const dataError = getDataApi(error);
      toastError(dataError.message)
    })
    .finally(() => {
      hideLoad();
      resetAction();
      resonReject.value = null;
    })
  }

  const handleCancelReject = () => {
    deleteKey("reasonReject")
    resetAction();
  }


  const handleConfirm = (event, action, data) => {
    setAction(action);
    setDataAction(data)
    event.stopPropagation();
  }

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.createdDate = formatTimestamp(item.createdAt, "DD/MM/YYYY")
      item.namePrint = item.modifyId + " - " + item.name;
      item.timeAppliedEditPrint = formatTimestamp(item.timeAppliedEdit, "DD/MM/YYYY HH:mm")
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
          title: `Bạn có chắc chắn đồng ý việc thêm địa điểm "${dataAction.name}" của đối tác "${dataAction.partnerFullName}" không?`,
          message: "Địa điểm sẽ đi vào hoạt động vào " + formatTimestamp(dataAction.timeAppliedEdit, "DD/MM/YYYY HH:mm")
        }
      }else if(action === 2) {
        return {
          title: `Bạn có chắc chắn từ chối việc thêm địa điểm "${dataAction.name}" của đối tác "${dataAction.partnerFullName}" không?`,
          message: <MessageReject key={"MessageReject"} data={resonReject}/>
        }
      }
    }else if (dataSearch.tab === 4){
      if(action === 1) {
        return {
          title: `Bạn có chắc chắn đồng ý việc sửa thông tin địa điểm "${dataAction.name}" của đối tác "${dataAction.partnerName}" không?`,
          message: "Thông tin chỉnh sửa sẽ được áp dụng vào "+ formatTimestamp(dataAction.timeAppliedEdit, "DD/MM/YYYY HH:mm")
        }
      }else if(action === 2) {
        return {
          title: `Bạn có chắc chắn từ chối việc sửa thông tin địa điểm "${dataAction.name}" của đối tác "${dataAction.partnerFullName}" không?`,
          message: "Yêu cầu sẽ chuyển sang trạng thái bị từ chối"
        }
      }
    }

    return {}
  }
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
          showTotal: showTotal
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
