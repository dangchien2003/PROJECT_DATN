import DividerCustom from "@/components/DividerCustom";
import ModalCustom from "@/components/ModalCustom";
import { useRequireField } from "@/hook/useRequireField";
import { Button } from "antd";
import { useEffect, useState } from "react";
import SearchHistory from "./SearchHistory";
import TableHistory from "./TableHistory";

const HistoryTicketSold = ({ id }) => {
  const [showHistory, setShowHistory] = useState();
  const { resetRequireField } = useRequireField();
  const [dataSearch] = useState({
    ticketId: id,
    buyDate: null,
    useDate: null,
    status: null
  });

  useEffect(() => {
    resetRequireField()
  }, [resetRequireField])
  return (
    <div className='HistoryTicketSold'>
      <Button color="primary" variant="solid" onClick={() => setShowHistory(true)}>Lịch sử bán</Button>
      {showHistory && <ModalCustom onClose={() => setShowHistory(false)}>
        <div>
          <SearchHistory dataSearch={dataSearch} />
          <DividerCustom style={{ width: "80%" }} />
          <TableHistory dataSearch={dataSearch} />
        </div>
      </ModalCustom>}
    </div>
  );
};

export default HistoryTicketSold;