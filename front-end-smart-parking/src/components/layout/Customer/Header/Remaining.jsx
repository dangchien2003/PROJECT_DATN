import { formatCurrency } from '@/utils/number'
import React from 'react'
import { useSelector } from 'react-redux'

const Remaining = () => {
  const remaining = useSelector(state => state.remaining)
  return (
    <div class="remaining">
      <div className='label'>Số dư:</div>
      <div className='box-quantity'>
        <span className='quantity'>
          <span>{formatCurrency(remaining)}</span>
          {/* <span className='plus'>+</span> */}
        </span>
        <span style={{paddingLeft: 8}}>Đ</span>
      </div>
    </div>
  )
}

export default Remaining
