import ChildContent from '@/components/layout/Customer/ChildContent';
import ModalCustom from '@/components/ModalCustom';
import { Button, Flex } from 'antd';
import { useState } from 'react';
import RequestAddCard from '../RequestAddCard';
import CardApproved from './CardApproved';
import HistoryRequestAdditionalCard from './HistoryRequestAdditionalCard';
import './style.css';

const CardManager = () => {
  const [showFormAdd, setShowFormAdd] = useState(false);

  const handleCloseFormAdd = () => {
    setShowFormAdd(false);
  }

  const onRequestSuccess = () => {
    setShowFormAdd(false);
  }

  
  const handleShowFormAdd = () => {
    setShowFormAdd(true);
  }

  return (
    <div className='card-manager'>
      <ChildContent>
      <h2 className='page-name'>Quản lý thẻ</h2>
      <Flex justify='right' className='action'>
        <Button variant='solid' color='cyan' onClick={handleShowFormAdd}>Yêu cầu thẻ mới</Button>
      </Flex>
      {/* vé đã được duyệt */}
      <CardApproved/>
      {/* danh sách chờ */}
      <HistoryRequestAdditionalCard />
    </ChildContent>
      {showFormAdd && <ModalCustom onClose={handleCloseFormAdd}>
        <RequestAddCard maxRequestTimes={0} onSuccess={onRequestSuccess}/>
      </ModalCustom>}
    </div>
  );
};

export default CardManager;