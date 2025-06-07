import { Steps } from 'antd'
import React from 'react'

const StepOrder = ({current = 0}) => {
  return (
    <Steps
    className='step'
    size="small"
    current={current}
    items={[
      {
        title: 'Chọn thời hạn',
      },
      {
        title: 'Xác nhận',
      },
      {
        title: 'Thanh toán',
      },
      {
        title: 'Hoàn thành',
      },
    ]}
  />
  )
}

export default StepOrder
