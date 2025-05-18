import { useState, useEffect } from "react";
import { Table, Tooltip } from "antd";
import { fakeDataTable } from "./dataTest";
import { VEHICLE } from "@/utils/constants";
import { useLoading } from "@/hook/loading";
import { formatTimestamp } from "@/utils/time";
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
    title: "Tên vé",
    dataIndex: "ticketNamePrint",
    key: "1",
    sorter: false,
    width: 150,
  },
  {
    title: "Nội dung chỉnh sửa",
    dataIndex: "modifyDescription",
    key: "2",
    sorter: false,
    width: 250,
  },
  {
    title: "Phương tiện",
    dataIndex: "vehiclePrint",
    key: "3",
    sorter: true,
    width: 120,
  },
  {
    title: "Giá vé",
    dataIndex: "pricePrint",
    key: "3.1",
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
  {
    title: "Thời gian phát hành/Áp dụng",
    dataIndex: "timeApplyPrint",
    align: "center",
    key: "5",
    sorter: true,
    width: 150,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "6",
    fixed: "right",
    width: 120,
  }
];

const mapFieldColumnsSort = {
  pricePrint: "price",
  timeApplyPrint: "timeAppliedEdit"
}


const sortDefault = {
  field: "name",
  order: "ascend",
}
const TableCustomListRequestEditTicket = ({ searchTimes, dataSearch }) => {
  const navigate = useNavigate()
  const { hideLoad, showLoad } = useLoading()
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [dataAction, setDataAction] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState(sortDefault);
  const loadData = (newPagination, sorter) => {
    if (!sorter.field) {
      setSorter(sortDefault);
    } else {
      const newSorter = {
        field: mapFieldColumnsSort[sorter.field] ? mapFieldColumnsSort[sorter.field] : sorter.field,
        order: sorter.order,
      };
      setSorter(newSorter);
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
    navigate(`/admin/ticket/detail/1/2/${data.id}`)
  };

  useEffect(() => {
    loadData(pagination, sorter);
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
      item.stt = (currentPage - 1) * pageSize + index + 1;
      item.vehiclePrint = (
        <div>
          <span style={{ margin: "0 4px" }}>{VEHICLE[item.vehicle].icon}</span>
          {VEHICLE[item.vehicle].name}
        </div>
      );
      item.pricePrint = (
        <div>
          <div>1 giờ: 12.000 đ</div>
          <div>1 ngày: 12.000 đ</div>
          <div>1 tuần: 50.000 đ</div>
          <div>1 tháng: 120.000 đ</div>
        </div>
      );
      item.timeApplyPrint = (
        <div>
          <div>{formatTimestamp(42124214, "DD/MM/YYYY")}</div>
          <div>{formatTimestamp(42124214, "HH:mm")}</div>
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
            <div onClick={(event)=> {handleConfirm(event, 1, item)}}>
              <MdOutlineCancel style={{ color: "#ff4d4f", fontSize: 24, cursor: 'pointer' }} />
            </div>
          </Tooltip>
        </div>
      );
      const modifyDescription = "Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé Chỉnh sửa lại tên vé";
      item.modifyDescription = (
        <div
          style={{
            maxHeight: 100,
            overflowY: "auto",
            scrollbarWidth: "thin",
            msOverflowStyle: "none",
          }}
        >
          {modifyDescription}
        </div>
      );

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
      {action === 1 && <PopConfirmCustom type="warning" title='Bạn có chắc chắn duyệt việc sửa vé "Vé ngày" của đối tác EAON MALL không?' message="Thông tin chỉnh sửa sẽ được áp dụng vào lúc 11:11" handleOk={handleAllowApprove} handleCancel={handleCancelApprove} key={"approve"}/>}
      {action === 2 && <PopConfirmCustom type="warning" title='Bạn có chắc chắn thực hiện việc từ chối sửa vé "Vé ngày" của đối tác EAON MALL không?' message="Yêu cầu sẽ được chuyển sang trạng thái bị từ chối" handleOk={handleAllowReject} handleCancel={handleCancelReject} key={"reject"}/>}
    </>
  );
};

export default TableCustomListRequestEditTicket;
