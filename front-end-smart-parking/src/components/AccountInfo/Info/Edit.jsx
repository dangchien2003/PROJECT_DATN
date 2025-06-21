import { Tooltip } from 'antd'
import { FaEdit } from 'react-icons/fa'

const Edit = ({ onClick, value }) => {
  const handleClick = () => {
    if(onClick) {
      onClick(value);
    }
  }
  
  return (
    <Tooltip title="Thay đổi" onClick={handleClick}>
      <div className='btn-link' onClick={onClick}>
        <FaEdit className='edit-item' />
      </div>
    </Tooltip>
  )
}

export default Edit
