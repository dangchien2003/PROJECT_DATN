import ChildContent from '@/components/layout/Customer/ChildContent';
import ModalCustom from '@/components/ModalCustom';
import { Button, Flex } from 'antd';
import { useEffect, useState } from 'react';
import RequestAddCard from '../RequestAddCard';
import CardApproved from './CardApproved';
import HistoryRequestAdditionalCard from './HistoryRequestAdditionalCard';
import './style.css';
import { useSelectMenu } from '@/hook/useSelectMenu';
import { MENU_CUSTOMER_ID } from '@/utils/constants';

const CardManager = () => {
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [maxTimes, setMaxTimes] = useState(0);
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_CUSTOMER_ID.QUAN_LY_THE);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleCloseFormAdd = () => {
    setShowFormAdd(false);
  }

  const onRequestSuccess = () => {
    setShowFormAdd(false);
  }


  const handleShowFormAdd = () => {
    setShowFormAdd(true);
  }

  const onLoadHistory = (maxTime) => {
    setMaxTimes(maxTime);
  }

  return (
    <div className='card-manager'>
      <ChildContent>
        <h2 className='page-name'>Quản lý thẻ</h2>
        <Flex justify='right' className='action'>
          <Button variant='solid' color='cyan' onClick={handleShowFormAdd}>Yêu cầu thẻ mới</Button>
        </Flex>
        {/* vé đã được duyệt */}
        <CardApproved />
        {/* danh sách chờ */}
        <HistoryRequestAdditionalCard onload={onLoadHistory}/>
      </ChildContent>
      {showFormAdd && <ModalCustom onClose={handleCloseFormAdd}>
        <RequestAddCard maxRequestTimes={maxTimes} onSuccess={onRequestSuccess} />
      </ModalCustom>}
    </div>
  );
};

export default CardManager;