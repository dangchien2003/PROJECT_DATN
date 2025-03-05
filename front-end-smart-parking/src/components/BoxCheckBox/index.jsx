import { Checkbox } from 'antd'
import React from 'react'

const BoxCheckBox = ({label, checked, disabled}) => {
  return (
    
    <div className="box-text-field">
        <span className='label'>{label}:</span>
        <Checkbox style={{margin: 8}} checked={checked} disabled={disabled}/>
    </div>
  )
}

export default BoxCheckBox
