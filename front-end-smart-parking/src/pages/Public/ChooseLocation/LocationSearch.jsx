import { setSearching } from '@/store/startSearchSlice';
import { Checkbox, Input, Tooltip } from 'antd';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;

const LocationSearch = ({ dataSearch }) => {
  const dispatch = useDispatch();
  const {isSearching} = useSelector(state => state.startSearch)
  const [name, setName] = useState(null);
  // const [category, setCategory] = useState(null);

  const handleChangeName = (e) => {
    const value = e.target.value;
    setName(value);
  }

  const handleBlur = () => {
    if(name === null) return;
    setName(pre => pre.trim());
  }

  const handleSearch = () => {
    if(name === null) return;
    dataSearch.name = name.trim();
    dataSearch.category = null;
    search();
  }

  const search = () => {
    if(!isSearching) {
      dispatch(setSearching(true));
    }
  }

  const onClear = () => {
    dataSearch.name = null;
    dataSearch.category = null;
    search();
  }

  return (
    <div className='parent-search'>
      <div className='search'>
        <Search
          onChange={handleChangeName}
          onBlur={handleBlur}
          onSearch={handleSearch}
          onClear={onClear}
          value={name}
          className='input'
          placeholder="Tìm kiếm địa điểm"
          allowClear
          enterButton={
            <Tooltip title="Tìm kiếm">
              <span>
                <FaSearch />
              </span>
            </Tooltip>}
        />
      </div>
      <div className='category'>
        <div className='content'>
          <CheckboxGroup options={[
            { value: 1, label: 'Dịch vụ gửi xe' },
            { value: 2, label: 'Trung tâm giải trí' },
            { value: 3, label: 'Trung tâm thương mại' },
          ]} />
        </div>
      </div>
    </div>
  )
}

export default LocationSearch
