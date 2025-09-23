import { Switch, Tooltip } from 'antd';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import './style.css';
import { toastError, toastSuccess } from '@/utils/toast';
import { disableTicket, enableTicket } from '@/service/ticketPurchasedService';
import { getDataApi } from '@/utils/api';
import { TICKET_PURCHASED_STATUS } from '@/utils/constants';

const MoreView = ({disableInp, ticketId, onChangeSuccess}) => {
  const [showAction, setShowAction] = useState(false);
  const [disable, setDisable] = useState(disableInp);
  const [disableLoading, setDisableLoading] = useState(false);

  const handleShowAction = () => {
    setShowAction(pre => !pre);
  }

  const handleChangeDisable = () => {
    if(disable) {
      handleEnable();
    } else {
      handleDisable();
    }
  }

  const handleEnable = () => {
    setDisableLoading(true);
    enableTicket(ticketId).then(() => {
      setDisable(false);
      toastSuccess("Đã huỷ vô hiệu thành công");
      onChangeSuccess(TICKET_PURCHASED_STATUS.BINH_THUONG.value);
    })
    .catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    })
    .finally(() => {
      setDisableLoading(false);
    })
  }

  const handleDisable = () => {
    setDisableLoading(true);
    disableTicket(ticketId).then(() => {
      setDisable(true);
      toastSuccess("Đã vô hiệu thành công");
      if(onChangeSuccess) {
        onChangeSuccess(TICKET_PURCHASED_STATUS.TAM_DINH_CHI.value);
      }
    })
    .catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    })
    .finally(() => {
      setDisableLoading(false);
    })
  }

  return (
    <div className='more-view pointer'>
      <Tooltip title="Xem thêm">
        <IoMdMore fontSize={18} onClick={handleShowAction} />
      </Tooltip>
      <AnimatePresence>{
        showAction &&
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className='more-action'>
            <Tooltip title="Sẽ không thể sử dụng vé khi đang vô hiệu">
              <div>Vô hiệu:
                <Switch
                  onChange={handleChangeDisable}
                  checked={disable}
                  loading={disableLoading}
                  style={{marginLeft: 16}}
                />
              </div>
            </Tooltip>
          </div>
        </motion.div>
      }
      </AnimatePresence>

    </div>
  );
};

export default MoreView;