import { adminSearch, madeCard } from "@/service/cardService";
import { setSearching } from "@/store/startSearchSlice";
import { getDataApi } from "@/utils/api";
import { CARD_STATUS, CARD_TYPE, lineLoading } from "@/utils/constants";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError, toastSuccess } from "@/utils/toast";
import { Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonStatus from "../ButtonStatus";
import { FaCheck } from "react-icons/fa6";
import PopConfirmCustom from "../PopConfirmCustom";
import { useLoading } from "@/hook/loading";

const baseColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 1,
  },
  {
    title: "Số thẻ",
    dataIndex: "numberCard",
    key: "1",
  },
  {
    title: "Ngày phát hành",
    dataIndex: "issuedDatePrint",
    key: "2",
    align: "center"
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
    title: "Người yêu cầu",
    dataIndex: "requestName",
    key: "5",
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "6",
    fixed: 'right',
    align: 'center'
  },
];

const TableListCard = ({ dataSearch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSearching } = useSelector(state => state.startSearch);
  const [firstSearch, setFirstSearch] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const {showLoad, hideLoad} = useLoading();
  const [cardNextStatus, setCardNextStatus] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter] = useState({
    field: null,
    order: null,
  });

  const convertResponseToDataTable = (data, currentPage, pageSize) => {
    return data.map((item, index) => {
      item.issuedDatePrint = formatTimestamp(item.issuedDate, "DD/MM/YYYY");
      item.statusPrint = (<ButtonStatus color={CARD_STATUS[item.status]?.color} label={CARD_STATUS[item.status]?.label} />);
      item.typePrint = CARD_TYPE[item.type]?.label;
      item.action = <div>
        <Tooltip title="Đã cấp thẻ">
          <FaCheck className="success pointer" onClick={(e) => {handleClickNextStatus(e, item)}}/>
        </Tooltip>
      </div>
      item.stt = (currentPage - 1) * pageSize + index + 1;
      return item;
    });
  };

  const loadData = (newPagination, sorter) => {
    setLoading(true);
    setData([]);
    adminSearch(dataSearch, newPagination.current - 1, newPagination.pageSize, sorter.field, sorter.order)
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
    navigate(`/admin/card/detail/0/${data.id}`)
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

  useEffect(() =>{
    if(dataSearch.status !== 1) {
      setColumns(baseColumns.filter(item => (item.key !== "6")))
    } else {
      setColumns(baseColumns.filter(item => item.key !== "1"))
    }
  }, [dataSearch.status])
  
  const handleClickNextStatus = (e, card) => {
    e.stopPropagation();
    setCardNextStatus(card);
  }

  const handleAgreeNextStatus = () => {
    showLoad(lineLoading);
    madeCard(cardNextStatus.id).then(response => {
      loadData(pagination, sorter);
      toastSuccess("Chuyển trạng thái thành công");
      setCardNextStatus(null);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(hideLoad);
  }
  
  const handleCancelNextStatus = () => {
    setCardNextStatus(null);
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
      {cardNextStatus && <PopConfirmCustom type={'warning'} title={`Bạn có chắc chắn muốn chuyển trạng thái thẻ yêu cầu bởi "${cardNextStatus.requestName}" không?`} message={`Thẻ sẽ được chuyển trạng thái chờ kích hoạt`} handleOk={handleAgreeNextStatus} handleCancel={handleCancelNextStatus} />}
    </>
  );
};

export default TableListCard;
