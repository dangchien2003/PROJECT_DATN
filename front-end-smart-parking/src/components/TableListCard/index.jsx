import { useState, useEffect } from "react";
import { Table } from "antd";
import { fakeDataTable } from "./dataTest";
import ButtonStatus from "../ButtonStatus";
import { CARD_STATUS, CARD_TYPE} from "@/utils/constants";
import { formatTimestamp } from "@/utils/time";
import { useLoading } from "@/hook/loading";
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
    title: "Số thẻ",
    dataIndex: "numberCard",
    key: "1",
    sorter: true,
    // width: 150,
  },
  {
    title: "Ngày phát hành",
    dataIndex: "issuedDatePrint",
    key: "2",
    sorter: true,
    align: "center"
    // width: 120,
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
    title: "Người yêu cầu",
    dataIndex: "requestCreateName",
    key: "5",
    sorter: true,
    // width: 120,
  },
];

const convertResponseToDataTable = (response, currentPage, pageSize) => {
  return response.data.map((item, index) => {
    item.issuedDatePrint = formatTimestamp(item.issuedDate, "DD/MM/YYYY")
    item.statusPrint = (<ButtonStatus color={CARD_STATUS[item.status]?.color} label = {CARD_STATUS[item.status]?.label} />)
    item.typePrint = CARD_TYPE[item.type]?.label
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableListCard = ({searchTimes, dataSearch }) => {
  const navigate = useNavigate()
  const { showLoad, hideLoad } = useLoading();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
    navigate(`/card/detail/0/${data.numberCard}`)
  };

  useEffect(() => {
    loadData(pagination, sorter);
    console.log(dataSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTimes]);
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
      }}
      onRow={(record) => {
        return {
          onClick: () => handleClickRow(record),
        };
      }}
    />
  );
};

export default TableListCard;
