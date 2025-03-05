import { Input } from 'antd'
import React from 'react'
const { TextArea } = Input;

const BoxTextArea = ({label, value, disabled, colorGray, rows}) => {
  return (
    <div className="box-text-field box-text-area">
        <div className='label'>{label}:</div>
        <TextArea value={value} disabled={disabled} style={!colorGray && {color: "black"}} rows={!rows ? 1 : rows} />
    </div>
  )
}

export default BoxTextArea
