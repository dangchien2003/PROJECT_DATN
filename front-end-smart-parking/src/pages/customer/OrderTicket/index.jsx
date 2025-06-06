import React from 'react'
import ChildContent from '@/components/layout/Customer/ChildContent'
import StepOrder from './StepOrder'
import ChooseCategory from './ChooseCategory'
import ChooseTime from './ChooseTime'
import { PRICE_CATEGORY } from '@/utils/constants'
import Location from './Location'
import { Col, Flex, Row } from 'antd'
import Map from '@/components/Map'
import { useSearchParams } from 'react-router-dom'
import { isNullOrUndefined } from '@/utils/data'
import PositionUsed from './PositionUsed'

const OrderTicket = () => {
  const [category, setCategory] = React.useState(PRICE_CATEGORY.TIME.value);
  const [startTime, setStartTime] = React.useState();
  const [searchParams] = useSearchParams();
  const locationFromParam = searchParams.get("locationChoosed");
  const [locationChoosed, setLocationChoosed] = React.useState((!isNullOrUndefined(locationFromParam) && locationFromParam?.length > 0) ? Number(locationFromParam) : null);
  const onChooseItem = (categoryChoosed) => {
    setCategory(categoryChoosed);
  }
  const onChooseLocation = (data) => {
    setLocationChoosed(data);
  }

  const onChangeStartTime = (time) => {
    setStartTime(time);
  }
  return (
    <div className='order-ticket-step1'>
      <ChildContent>
        <StepOrder current={0} />
      </ChildContent>
      <ChildContent>
        <ChooseCategory onChooseItem={onChooseItem} category={category} />
      </ChildContent>
      <ChildContent className='mt16'>
        <Flex gap={32} wrap="wrap" className='box123'>
          <Location onChoose={onChooseLocation} selected={locationChoosed}/>
          <Map className="map" focus={locationChoosed?.position}/>
        </Flex>
        {locationChoosed && <Row gutter={16}  className='box123'>
          <Col lg={8} md={24} className='choose-time'>
            <ChooseTime category={category} onChangeStartTime={onChangeStartTime}/>
          </Col>
          <Col lg={16} className='position-used'>
            <PositionUsed startTime={startTime}/>
          </Col>
        </Row>}
      </ChildContent>
    </div>
  )
}

export default OrderTicket
