import CardCustom from '@/components/CardCustom';
import useResponsiveKey from '@/hook/useReponsive';
import { Col, Empty, Flex, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';
import './style.css';
import { getCardApproved } from '@/service/cardService';
import { getDataApi } from '@/utils/api';
import { toastError } from '@/utils/toast';
import LoadingComponent from '@/components/LoadingComponent';

const CardApproved = () => {
  const refListCard = useRef();
  const [widthCard] = useState(500);
  const { key } = useResponsiveKey();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage] = useState(0)
  // const [totalPage, setTotalPage] = useState(0)
  const pageSize = 5;

  useEffect(() => {
    setLoading(true);
    getCardApproved(currentPage, pageSize).then((res) => {
      const response = getDataApi(res);
      console.log(response)
      setData(response.data);
      // setData([]);
      // setTotalPage(response.totalPages)
    })
      .catch((e) => {
        const response = getDataApi(e);
        toastError(response.message);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [currentPage])

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
  return (
    <Row className='card-wrapper inner-top-bottom-shadow pr'>
      {loading && <LoadingComponent transparent/>}
      {!loading && <>
        <Col lg={1} md={1} sm={2} xs={2} className="next">
          {(key !== "sm" && key !== "xs" && data.length > 0) && <IoIosArrowDropleft className='left' onClick={handleClickLeft} />}
        </Col>
        <Col lg={22} md={22} sm={24} xs={24}>
          <Flex className='card-list hide-scrollbar' ref={refListCard}>
            {data.map(item => <CardCustom data={item} isAdmin={false} parentRef={refListCard} />)}
          </Flex>
        </Col>
        <Col lg={1} md={1} sm={2} xs={2} className="next">
          {(key !== "sm" && key !== "xs" && data.length > 0) &&
            <IoIosArrowDropright className='right' onClick={handleClickRight} />}
        </Col>
      </>}
      {(!loading && data.length === 0) && <Empty description="Chưa có thẻ" style={{width: "100%"}}/>}
    </Row>
  );
};

export default CardApproved;