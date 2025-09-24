import ModalCustom from "@/components/ModalCustom";
import { Button, Flex } from "antd";
import { useRef, useState } from "react";
import { MdHistory } from "react-icons/md";
import { PiSquaresFourDuotone } from "react-icons/pi";
import PositionUsed from "./PositionUsed";
import dayjs from 'dayjs'; 

const Action = ({ location }) => {
  const start = useRef(dayjs().subtract(1, "week"));
  const end = useRef(dayjs().add(1, "month"));
  const [showTrangThaiBaiDo, setShowTrangThaiBaiDo] = useState(false);
  const [showLichSu, setShowLichSu] = useState(false);
  const handleCloseModal = () => {
    setShowTrangThaiBaiDo(false);
    setShowLichSu(false);
  }
  return (
    <>
      <Flex gap={8}>
        <Button
          color="primary"
          variant="solid"
          onClick={() => setShowTrangThaiBaiDo(true)}
        >
          <PiSquaresFourDuotone style={{ fontSize: 18 }} />Tình trạng bãi đỗ
        </Button>
        <Button 
          color="cyan" 
          variant="solid" 
          onClick={() => setShowLichSu(true)}>
            <MdHistory style={{ fontSize: 18 }} />Lịch sử ra vào
          </Button>
      </Flex>
      {showTrangThaiBaiDo && <ModalCustom onClose={handleCloseModal}>
        <PositionUsed startTime={start.current} endTime={end.current} capacity={location.capacity} locationId={location.locationId}/>
      </ModalCustom>}
      {showLichSu && <ModalCustom onClose={handleCloseModal}>
        ávas
      </ModalCustom>}
    </>
  );
};

export default Action;