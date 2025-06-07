import React, { useState } from 'react';
import {Input, Tag, AutoComplete, Button } from 'antd';

const FormBuyFor = () => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);

  const suggestions = ['example@gmail.com', 'info@company.com', '+84912345678', '+84123456789'];

  const isValid = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{9,15}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const addTag = (value) => {
    const trimmed = value.trim().replace(/,$/, '');
    if (!trimmed || !isValid(trimmed) || tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleClose = (removedTag) => {
    setTags(tags.filter(tag => tag !== removedTag));
  };

  return (
    <div className='buy-for'>
      <h1>Mua hộ cho</h1>
      <div style={{ marginTop: 10 }} className='box-input'>
        {tags.map(tag => (
          <Tag className='tag' key={tag} closable onClose={() => handleClose(tag)}>
            {tag}
          </Tag>
        ))}
        <AutoComplete
          options={suggestions
            .filter(s => s.includes(inputValue) && !tags.includes(s))
            .map(s => ({ value: s }))}
          value={inputValue}
          onChange={handleInputChange}
          onSelect={addTag}
        >
          <Input
            placeholder="Nhập email hoặc sđt người nhận vé"
            onKeyDown={handleKeyDown}
            className='no-outline input'
          />
        </AutoComplete>
      </div>
      <div className='action'>
        <div className='label'>Bạn đang mua vé cho {tags.length} người</div>
        <div>
          <Button color="danger" variant="solid" className='payment'>Thanh toán</Button>
        </div>
      </div>
    </div>
  );
};

export default FormBuyFor;
