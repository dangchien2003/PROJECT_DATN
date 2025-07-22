import { useLoading } from "@/hook/loading";
import { adminSearchRequestAdd, approveRequest, rejectRequest } from "@/service/cardService";
import { setSearching } from "@/store/startSearchSlice";
import { getDataApi } from "@/utils/api";
import { CARD_STATUS, CARD_TYPE } from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { toastError, toastSuccess } from "@/utils/toast";
import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonStatus from "../ButtonStatus";
import PopConfirmCustom from "../PopConfirmCustom";
import MessageReject from "../MessageReject";

const TableListCardWaitApprove = ({dataSearch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {showLoad, hideLoad} = useLoading();
  const { isSearching } = useSelector(state => state.startSearch);
  const [firstSearch, setFirstSearch] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [dataAction, setDataAction] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter] = useState({
    field: null,
    order: null,
  });
  const reasonReject = {
    value: null
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "0",
      sorter: false,
      width: 1,
    },
    {
      title: "Trạng thái",
      dataIndex: "statusPrint",
      key: "3",
      sorter: false,
    },
    {
      title: "Loại thẻ",
      dataIndex: "typePrint",
      key: "4",
      sorter: false,
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "createdDate",
      key: "2",
      align: "center"
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requestName",
      key: "5",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "6",
      fixed: "right",
      width: 150,
      hidden: dataSearch.status !== 0, 
    }
  ];

  const loadData = (newPagination, sorter) => {
    setLoading(true);
        setData([]);
        adminSearchRequestAdd(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
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
            dispatch(setSearching(false))
          });
  };

  const handleTableChange = (newPagination, _, sorter) => {
    setPagination(newPagination);
    loadData(newPagination, sorter);
  };

  const handleClickRow = (data) => {
    navigate(`/card/detail/1/${data.id}`)
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

  const resetAction = () => {
    setAction(null);
    setDataAction(null);
  }

  const handleAllowApprove = () => {
    showLoad("Đang xử lý");
    approveRequest(dataAction.id).then(() => {
      toastSuccess("Phê duyệt thành công");
      loadData(pagination, sorter);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(() => {
      hideLoad();
      resetAction();
    })
  }

  const handleCancelApprove = () => {
    resetAction();
  }

  const handleAllowReject = () => {
    if(reasonReject.value === null 
      || reasonReject.value?.trim().length === 0) {
      return;
    }
    showLoad("Đang xử lý");
    rejectRequest(dataAction.id, reasonReject.value).then(() => {
      toastSuccess("Từ chối thành công");
      loadData(pagination, sorter);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(() => {
      hideLoad();
      resetAction();
      reasonReject.value = null;
    })
  }

  const handleCancelReject = () => {
    resetAction();
    reasonReject.value = null;
  }


  const handleConfirm = (event, action, data) => {
    setAction(action);
    setDataAction(data)
    event.stopPropagation();
  }

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
  return data.map((item, index) => {
    item.createdDate = formatTimestamp(item.requestDate, "DD/MM/YYYY")
    item.statusPrint = (<ButtonStatus color={CARD_STATUS[item.status]?.color} label = {CARD_STATUS[item.status]?.label} />)
    item.typePrint = CARD_TYPE[item.type]?.label
    item.action = (
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Tooltip title="Duyệt">
          <div onClick={(event)=> {handleConfirm(event, 1, item)}}>
            <FaRegCheckCircle style={{ color: "#00c49f", fontSize: 21, cursor: 'pointer' }}/>
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
        }}
        onRow={(record) => {
          return {
            onClick: () => handleClickRow(record),
          };
        }}
      />
      {action === 1 && <PopConfirmCustom type="warning" title={`Bạn có chắc chắn việc tiếp tục cấp thẻ cho ${dataAction.ownerName?.toUpperCase()} không?`} message="Yêu cầu sẽ được chuyển sang trạng thái chờ cấp" handleOk={handleAllowApprove} handleCancel={handleCancelApprove} key={"approve"}/>}
      {action === 2 && <PopConfirmCustom type="warning" title={`Bạn có chắc chắn việc từ chối cấp thẻ cho ${dataAction.ownerName?.toUpperCase()} không?`} message={<MessageReject message={"Yêu cầu sẽ được chuyển sang trạng thái bị từ chối"} data={reasonReject} />} handleOk={handleAllowReject} handleCancel={handleCancelReject} key={"reject"} />}
    </>
  );
};

export default TableListCardWaitApprove;
