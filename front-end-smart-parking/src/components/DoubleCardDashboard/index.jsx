import { Card, Divider } from 'antd';
import React from 'react';
import './style.css';

const DoubleCardDashboard = ({ borderColor = "#f6a621", label, value={}, icon }) => {
  return (
    <Card
      style={{
        width: 350,
        height: 110,
        borderRadius: 8,
        border: '1px solid #f0f0f0',
        borderLeft: "8px solid " + borderColor,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      bodyStyle={{
        paddingTop: 8,
        paddingBottom: 8,
        height: '100%',
      }}
    >
      <div style={{textAlign: 'right', color: '#666666', marginBottom: 8}}>
        {icon && <img src={icon} alt='icon' style={{width: 20, marginRight: 8}}/>}{label}
      </div>
      <div style={{display: 'flex', textAlign: 'center'}}>
        <div style={{width: 170,padding: '0 8px'}}>
          <div className='title truncated-text'>{value.title1}</div>
          <div className='value truncated-text'>{value.value1}</div>
        </div>
        <div style={{border: '1px solid black', height: 50}}></div>
        <div style={{width: 170,padding: '0 8px'}}>
        <div className='title truncated-text'>{value.title2}</div>
        <div className='value truncated-text'>{value.value2}</div>
        </div>
      </div>
    </Card >
  );
};

export default DoubleCardDashboard;