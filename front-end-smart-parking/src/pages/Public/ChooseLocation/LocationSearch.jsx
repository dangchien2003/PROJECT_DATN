import { FaSearch } from 'react-icons/fa';
import { Checkbox, Input, Tooltip } from 'antd';
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;


const LocationSearch = () => {
  return (
    <div className='parent-search'>
      <div className='search'>
        <Search className='input' placeholder="Tìm kiếm địa điểm" enterButton={
          <Tooltip title="Tìm kiếm">
            <span>
              <FaSearch />
            </span>
          </Tooltip>} />
      </div>
      <div className='category'>
        <div className='content'>
        <CheckboxGroup options={[
              { value: 1, label: 'Dịch vụ gửi xe' },
              { value: 2, label: 'Trung tâm giải trí' },
              { value: 3, label: 'Trung tâm thương mại' },
            ]}/>
        </div>
      </div>
    </div>
  )
}

export default LocationSearch
