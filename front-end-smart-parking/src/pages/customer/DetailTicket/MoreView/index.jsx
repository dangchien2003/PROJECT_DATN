import { Switch, Tooltip } from 'antd';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import './style.css';
import { toastSuccess } from '@/utils/toast';

const MoreView = () => {
  const [showAction, setShowAction] = useState(false);
  const [disable, setDisable] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);

  const handleShowAction = () => {
    setShowAction(pre => !pre);
  }

  const handleChangeDisable = () => {
    setDisableLoading(true);
    setTimeout(() => {
      setDisable(pre => !pre);
      setDisableLoading(false);
      toastSuccess(disable ? "Đã huỷ vô hiệu thành công" : "Đã vô hiệu thành công")
    }, 2000)
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
                  style={{ marginLeft: 8 }}
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