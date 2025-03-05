import { Input } from 'antd'
import React from 'react'

const BoxTextField = ({label, value, disabled, colorGray, hideLabel}) => {
  return (
    <div className="box-text-field">
        {!hideLabel && <div className='label'>{label}:</div>}
        <Input value={value} disabled={disabled} style={!colorGray && {color: "black"}}/>
    </div>
  )
}

export default BoxTextField
