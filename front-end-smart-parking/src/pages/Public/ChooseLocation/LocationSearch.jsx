import { getLocationSuggestions } from '@/service/locationService';
import { setSearching } from '@/store/startSearchSlice';
import { getDataApi } from '@/utils/api';
import { isNullOrUndefined } from '@/utils/data';
import { toastError } from '@/utils/toast';
import { AutoComplete, Checkbox, Input, Spin, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;

const defaultPage = { current: 1, pageSize: 10, total: 0 };

const LocationSearch = ({ dataSearch }) => {
  const dispatch = useDispatch();
  const { isSearching } = useSelector(state => state.startSearch)
  const [suggestSearching, setSuggestSearching] = useState(false);
  const [openSuggest, setOpenSuggest] = useState(undefined);
  const [name, setName] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [pagination, setPagination] = useState(defaultPage);
  // const [category, setCategory] = useState(null);
  const debounceRef = useRef(null);
  const selectRef = useRef(false);

  const handleChangeName = (e) => {
    const value = e.target.value;
    setName(value);
  }

  const handleBlur = () => {
    if (name === null) return;
    setName(pre => pre.trim());
  }

  const handleSearch = () => {
    // tắt gợi ý
    setOpenSuggest(false);
    setTimeout(() => {
      // mở gợi ý mặc định
      setOpenSuggest(undefined);
    }, 2000)
    // set dataSearch
    if (name === null) return;
    dataSearch.name = name.trim();
    dataSearch.category = null;
    search();
  }

  const search = () => {
    if (!isSearching) {
      dispatch(setSearching(true));
    }
  }

  const onClear = () => {
    dataSearch.name = null;
    dataSearch.category = null;
    search();
  }

  useEffect(() => {
    // nếu select được chọn thì sẽ không call lấy gợi ý mà call search dữ liệu
    if (selectRef.current) {
      handleSearch();
      selectRef.current = false;
    } else {
      // xoá time out nếu đã có 
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (isNullOrUndefined(name) || name.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      debounceRef.current = setTimeout(() => {
        loadSuggest(defaultPage, name.trim());
      }, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [name]);

  const autoCompleteOptions = suggestions.map((s) => ({
    value: `${s.locationId}-${s.name}`,
    label: (
      <div>
        <div><b>{s.name}</b></div>
        <div style={{ fontSize: 12, color: '#999' }}>
          {s.address}
        </div>
      </div>
    ),
    data: s
  }));

  const handleSelect = (value, option) => {
    setName(option.data.name);
    selectRef.current = true;
  };

  const loadSuggest = (newPagination, key) => {
    setName(key);
    setSuggestSearching(true);
    getLocationSuggestions(key, newPagination.current - 1, newPagination.pageSize)
      .then((response) => {
        const data = getDataApi(response);
        setSuggestions((prev) =>
          newPagination.current === 1 ? data.data : [...prev, ...data.data]
        );
        setPagination({
          ...newPagination,
          total: data.totalElements,
        });
      })
      .catch((error) => {
        toastError(getDataApi(error).message);
      })
      .finally(() => {
        setSuggestSearching(false);
      });
  };

  const handlePopupScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isAtBottom && !suggestSearching && suggestions.length < pagination.total) {
      const nextPage = { ...pagination, current: pagination.current + 1 };
      loadSuggest(nextPage, name.trim());
    }
  };

  const dropdownRender = (menu) => (
    <div>
      {menu}
      {suggestSearching && (
        <div style={{ padding: '8px', textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      )}
    </div>
  );
  console.log(autoCompleteOptions)
  return (
    <div className='parent-search'>
      <div className='search'>
        <AutoComplete
          options={autoCompleteOptions}
          onSelect={handleSelect}
          onPopupScroll={handlePopupScroll}
          dropdownRender={dropdownRender}
          maxLength={50}
          value={name}
          open={openSuggest}
        >
          <Search
            onChange={handleChangeName}
            onBlur={handleBlur}
            onSearch={handleSearch}
            onClear={onClear}
            value={name}
            className='input'
            placeholder="Bạn muốn đi đâu?"
            allowClear
            enterButton={
              <Tooltip title="Tìm kiếm">
                <span>
                  <FaSearch />
                </span>
              </Tooltip>}
          />
        </AutoComplete>

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
