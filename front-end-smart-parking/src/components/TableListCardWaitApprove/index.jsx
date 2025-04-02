import { useState, useEffect } from "react";
import { Table, Tooltip } from "antd";
import { fakeDataTable } from "./dataTest";
import ButtonStatus from "../ButtonStatus";
import { CARD_STATUS, CARD_TYPE} from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useLoading } from "@/hook/loading";
import { useNavigate } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import PopConfirmCustom from "../PopConfirmCustom";

const TableListCardWaitApprove = ({searchTimes, dataSearch }) => {
  const navigate = useNavigate()
  const { showLoad, hideLoad } = useLoading();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [dataAction, setDataAction] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const defaultSort = {
    field: "numberCard",
    order: "ascend",
  }
  const [sorter, setSorter] = useState(defaultSort);

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
      // width: 190,
    },
    {
      title: "Loại thẻ",
      dataIndex: "typePrint",
      key: "4",
      sorter: false,
      // width: 120,
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "createdDate",
      key: "2",
      sorter: true,
      align: "center"
      // width: 120,
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requestCreateName",
      key: "5",
      sorter: true,
      // width: 120,
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
    if (!sorter.field || !sorter.order) {
      sorter = defaultSort;
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
    navigate(`/card/detail/1/${data.id}`)
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
    item.createdDate = formatTimestamp(item.createdAt, "DD/MM/YYYY")
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
      {action === 1 && <PopConfirmCustom type="warning" title="Bạn có chắc chắn việc tiếp tục cấp thẻ cho Lê Đăng Chiến không?" message="Yêu cầu sẽ được chuyển sang trạng thái chờ cấp" handleOk={handleAllowApprove} handleCancel={handleCancelApprove} key={"approve"}/>}
      {action === 2 && <PopConfirmCustom type="warning" title="Bạn có chắc chắn việc từ chối cấp thẻ cho Lê Đăng Chiến không?" message="Yêu cầu sẽ được chuyển sang trạng thái bị từ chối" handleOk={handleAllowReject} handleCancel={handleCancelReject} key={"reject"}/>}
    </>
  );
};

export default TableListCardWaitApprove;
