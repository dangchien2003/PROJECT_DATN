import { Divider } from 'antd'
import React from 'react'

const DividerCustom = ({ style }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={style}>
        <Divider />
      </div>
    </div>
  )
}

export default DividerCustom
