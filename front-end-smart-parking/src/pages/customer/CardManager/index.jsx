import CardCustom from '@/components/CardCustom';
import ChildContent from '@/components/layout/Customer/ChildContent';
import { Button, Col, Flex, Row } from 'antd';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';
import './style.css';
import { useRef, useState } from 'react';
import useResponsiveKey from '@/hook/useReponsive';
import ModalCustom from '@/components/ModalCustom';
import RequestAddCard from '../RequestAddCard';
import CardWait from './CardWait';

const CardManager = () => {
  const refListCard = useRef();
  const [widthCard, setWidthCard] = useState(500);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const { width, key } = useResponsiveKey();

  const handleClickLeft = () => {
    if (refListCard.current) {
      refListCard.current.scrollBy({ left: -widthCard, behavior: 'smooth' });
    }
  }

  const handleClickRight = () => {
    if (refListCard.current) {
      refListCard.current.scrollBy({ left: widthCard, behavior: 'smooth' });
    }
  }

  const handleShowFormAdd = () => {
    setShowFormAdd(true);
  }

  const handleCloseFormAdd = () => {
    setShowFormAdd(false);
  }

  return (
    <div className='card-manager'>
      <ChildContent>
        <h2 className='page-name'>Quản lý thẻ</h2>
        <Flex justify='right' className='action' onClick={handleShowFormAdd}>
          <Button variant='solid' color='cyan'>Yêu cầu thẻ mới</Button>
        </Flex>
        <Row className='card-wrapper inner-top-bottom-shadow'>
          <Col lg={1} md={1} sm={2} xs={2} className="next">
            {(key !== "sm" && key !== "xs") && <IoIosArrowDropleft className='left' onClick={handleClickLeft} />}
          </Col>
          <Col lg={22} md={22} sm={24} xs={24}>
            <Flex className='card-list hide-scrollbar' ref={refListCard}>
              <CardCustom parentRef={refListCard} />
              <CardCustom parentRef={refListCard} />
              <CardCustom parentRef={refListCard} />
              <CardCustom parentRef={refListCard} />
              <CardCustom parentRef={refListCard} />
              <CardCustom parentRef={refListCard} />
            </Flex>
          </Col>
          <Col lg={1} md={1} sm={2} xs={2} className="next">
            {(key !== "sm" && key !== "xs") &&
              <IoIosArrowDropright className='right' onClick={handleClickRight} />}
          </Col>
        </Row>
        <CardWait/>
      </ChildContent>
      {showFormAdd && <ModalCustom onClose={handleCloseFormAdd}>
        <RequestAddCard/>
      </ModalCustom>}
    </div>
  );
};

export default CardManager;