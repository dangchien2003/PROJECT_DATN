import { getSuggestions } from '@/service/accountService';
import { getDataApi } from '@/utils/api';
import { isNullOrUndefined } from '@/utils/data';
import { toastError } from '@/utils/toast';
import { AutoComplete, Button, Input, Spin, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';

const defaultPage = { current: 1, pageSize: 10, total: 0 };

const FormBuyFor = ({ onOk }) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [pagination, setPagination] = useState(defaultPage);

  const debounceRef = useRef(null);
  const selectRef = useRef(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (isNullOrUndefined(inputValue) || inputValue.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      loadData(defaultPage, inputValue.trim());
    }, 400);
  }, [inputValue]);

  const loadData = (newPagination, key) => {
    setInputValue(key);
    setSearching(true);
    getSuggestions(newPagination.current - 1, newPagination.pageSize, key)
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
        setSearching(false);
      });
  };

  const handlePopupScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isAtBottom && !searching && suggestions.length < pagination.total) {
      const nextPage = { ...pagination, current: pagination.current + 1 };
      loadData(nextPage, inputValue.trim());
    }
  };

  const handleSelect = (value, option) => {
    if (tags.some((tag) => tag.id === option.data.id)) return;
    setTags([...tags, { ...option.data }]);
    selectRef.current = true;
  };

  const handleClose = (removedTag) => {
    setTags(tags.filter((tag) => tag.id !== removedTag.id));
  };

  const handleOk = () => {
    if (onOk) onOk(tags);
  };

  const dropdownRender = (menu) => (
    <div>
      {menu}
      {searching && (
        <div style={{ padding: '8px', textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      )}
    </div>
  );

  const filteredSuggestions = suggestions.filter(
    (s) => !tags.some((tag) => tag.id === s.id)
  );

  const autoCompleteOptions = filteredSuggestions.map((s) => ({
    value: `${s.fullName} * ${s.email}`,
    label: (
      <div>
        <div><b>{s.fullName}</b></div>
        <div style={{ fontSize: 12, color: '#999' }}>
          {s.email} {s.phoneNumber ? ` - ${s.phoneNumber}` : ''}
        </div>
      </div>
    ),
    data: s,
  }));

  const handleChangeValue = (e) => {
    setInputValue(e.target.value);
  }

  return (
    <div className="buy-for">
      <h1>Mua hộ cho</h1>
      <div className="box-input" style={{ marginTop: 10 }}>
        {tags.map((tag) => (
          <Tag className="tag" key={tag.id} closable onClose={() => handleClose(tag)}>
            <b>{tag.fullName}</b>
          </Tag>
        ))}

        <AutoComplete
          options={autoCompleteOptions}
          onSelect={handleSelect}
          onPopupScroll={handlePopupScroll}
          dropdownRender={dropdownRender}
          maxLength={50}
          value={inputValue}
        >
          <Input
            placeholder="Nhập tên, email hoặc sđt người nhận"
            className="no-outline input"
            autoComplete="new-password"
            name="customReceiver"
            onChange={handleChangeValue}
          />
        </AutoComplete>
      </div>

      <div className="action">
        <div className="label">Bạn đang mua vé cho {tags.length} người</div>
        <Button type="primary" className="payment" onClick={handleOk}>
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default FormBuyFor;
