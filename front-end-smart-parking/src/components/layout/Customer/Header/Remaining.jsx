import React from 'react'

const Remaining = () => {

  return (
    <div class="remaining">
      <div className='label'>Số dư:</div>
      <div className='box-quantity'>
        <span className='quantity'>
          <span>120.000</span>
          {/* <span className='plus'>+</span> */}
        </span>
        <span style={{paddingLeft: 8}}>Đ</span>
      </div>
    </div>
  )
}

export default Remaining
