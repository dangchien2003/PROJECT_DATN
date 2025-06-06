import { Col, Row } from 'antd'
import React from 'react'

const ItemBill = ({label, value}) => {
  return (
    <Row className='content-item'>
      <Col sm={12} md={12} lg={12} className='label'><span>{label}:</span></Col>
      <Col sm={12} md={12} lg={12} className='value-item'><span>{value}</span></Col>
    </Row>
  )
}

export default ItemBill
