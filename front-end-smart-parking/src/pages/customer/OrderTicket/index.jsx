import ChildContent from '@/components/layout/Customer/ChildContent'
import { MENU_CUSTOMER_ID, PRICE_CATEGORY } from '@/utils/constants'
import { Col, Flex, Row } from 'antd'
import React, { useEffect } from 'react'
import ChooseCategory from './ChooseCategory'
import ChooseTime from './ChooseTime'
import Location from './Location'
import PositionUsed from './PositionUsed'
import StepOrder from './StepOrder'
import { useSelectMenu } from '@/hook/useSelectMenu'

const OrderTicket = () => {
  const [category, setCategory] = React.useState(PRICE_CATEGORY.TIME.value);
  const [startTime, setStartTime] = React.useState(null);
  const [ticket, setTicket] = React.useState(null);
  const [locationChoosedFull, setLocationChoosedFull] = React.useState(null);
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_CUSTOMER_ID.DAT_VE);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const onChooseItem = (categoryChoosed) => {
    setCategory(categoryChoosed);
  }
  const onChooseLocation = (data) => {
    setLocationChoosedFull(data);
  }

  const onChangeStartTime = (time) => {
    setStartTime(time);
  }

  const handleLoadTicketSuccess = (data) => {
    setTicket(data);
  }

  return (
    <div className='order-ticket-step1'>
      <ChildContent>
        <StepOrder current={0} />
      </ChildContent>
      <ChildContent>
        <ChooseCategory onChooseItem={onChooseItem} onLoadTicket={handleLoadTicketSuccess} category={category} />
      </ChildContent>
      <ChildContent className='mt16'>
        <Flex gap={32} wrap="wrap" className='box123'>
          <Location onChooseLocation={onChooseLocation} />
        </Flex>
        {locationChoosedFull && <Row gutter={16} className='box123'>
          <Col lg={8} md={24} className='choose-time'>
            <ChooseTime category={category} onChangeStartTime={onChangeStartTime} location={locationChoosedFull} ticket={ticket} />
          </Col>
          <Col lg={16} className='position-used'>
            <PositionUsed startTime={startTime} />
          </Col>
        </Row>}
      </ChildContent>
    </div>
  )
}

export default OrderTicket
