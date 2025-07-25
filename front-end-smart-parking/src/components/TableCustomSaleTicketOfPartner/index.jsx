import { getListTicketPurchaseOfPartner } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import { TICKET_CATEGORY, VEHICLE } from "@/utils/constants";
import { formatCurrency } from "@/utils/number";
import { convertDataSelectboxToObject, convertObjectToDataSelectBox } from "@/utils/object";
import { showTotal } from "@/utils/table";
import { formatTimestamp } from "@/utils/time";
import { toastError } from "@/utils/toast";
import { Table } from "antd";
import { useEffect, useState } from "react";

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "0",
    sorter: false,
    width: 0,
    align: "center"
  },
  {
    title: "Vé",
    dataIndex: "ticketNamePrint",
    key: "1",
    sorter: false,
    width: 150,
  },
  {
    title: "Loại vé",
    dataIndex: "ticketCategoryPrint",
    key: "2",
    sorter: false,
    width: 100,
  },
  {
    title: "Địa điểm sử dụng",
    dataIndex: "locationPrint",
    key: "3",
    sorter: false,
    width: 150,
  },
  {
    title: "Số lượng",
    dataIndex: "ticketQuantity",
    key: "4",
    sorter: false,
    width: 50,
  },
  {
    title: "Số tiền",
    dataIndex: "totalPrint",
    key: "5",
    sorter: false,
    width: 100,
  },
  {
    title: "Phương tiện",
    dataIndex: "vehiclePrint",
    key: "6",
    sorter: false,
  },
  {
    title: "Ngày mua",
    dataIndex: "buyTime",
    align: "center",
    key: "7",
    sorter: false,
    width: 120,
  },
  {
    title: "Ngày sử dụng",
    dataIndex: "startTime",
    align: "center",
    key: "8",
    sorter: false,
    width: 120,
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "expireTime",
    align: "center",
    key: "9",
    sorter: false,
    width: 120,
  },
];


const ticketCategoryObject = convertDataSelectboxToObject(convertObjectToDataSelectBox(TICKET_CATEGORY));
const convertResponseToDataTable = (data, currentPage, pageSize) => {
  return data.map((item, index) => {
    // vé
    item.ticketNamePrint = (
      <div>
        {`${item.ticketId} - ${item.ticketName}`}
      </div>
    );
    // loại vé
    item.ticketCategoryPrint = ticketCategoryObject[item.ticketCategory].label;
    // địa điểm
    item.locationPrint = (
      <div>
        {`${item.locationId} - ${item.locationName}`}
      </div>
    );
    // số tiền
    item.totalPrint = formatCurrency(item.total) + " đ";
    // phương tiện
    item.vehiclePrint = (
      <div>
        <span style={{ margin: "0 4px" }}>{VEHICLE[item.vehicle].icon}</span>
        {VEHICLE[item.vehicle].name}
      </div>
    );
    // ngày mua
    item.buyTime = (
      <div>
        {formatTimestamp(item.buyAt, "DD/MM/YYYY HH:mm:ss")}
      </div>
    );
    // ngày sử dụng
    item.startTime = (
      <div>
        {formatTimestamp(item.start, "DD/MM/YYYY HH:mm:ss")}
      </div>
    );
    // ngày hết hạn
    item.expireTime = (
      <div>
        {formatTimestamp(item.expire, "DD/MM/YYYY HH:mm:ss")}
      </div>
    );
    item.stt = (currentPage - 1) * pageSize + index + 1;
    return item;
  });
};

const TableCustomSaleTicketOfPartner = ({partnerId}) => {
  const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0,
    });
  
    const loadData = (newPagination) => {
      setLoading(true);
      setData([])
      getListTicketPurchaseOfPartner(partnerId, newPagination.current - 1, newPagination.pageSize)
        .then((response) => {
          const data = getDataApi(response);
          const total = data?.totalElements;
          setData(
            convertResponseToDataTable(
              data.data,
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
        });
    };
  
    const handleTableChange = (newPagination, _, sorter) => {
      setPagination(newPagination);
      loadData(newPagination, sorter);
    };
  
    useEffect(() => {
      loadData(pagination);
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

export default TableCustomSaleTicketOfPartner;
