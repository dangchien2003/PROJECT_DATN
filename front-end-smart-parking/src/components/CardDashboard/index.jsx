import { Card } from 'antd';
import React from 'react';
import up from '@image/up.png'
import down from '@image/down.png'

const CardDashboard = ({ borderColor = "#f6a621", label, value="...", icon, growth }) => {
  return (
    <Card
      style={{
        width: 300,
        height: 100,
        borderRadius: 8,
        border: '1px solid #f0f0f0',
        borderLeft: "8px solid " + borderColor,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      bodyStyle={{
        paddingBottom: 8,
        height: '100%',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'space-between',
        height: '100%',
        alignContent: 'flex-end'
      }}>
        {icon}
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <div style={{ marginLeft: '12px' }}>
            <div className='truncated-text' style={{ fontSize: '14px', color: '#666', width: 180, textAlign: 'right' }}>{label}</div>
            <div className='truncated-text' style={{ fontSize: '24px', fontWeight: 'bold', width: 200, textAlign: 'right' }}>{value}{growth === 'up' && <img src={up} alt='up' style={{width: 20, paddingLeft: 3}}/>}{growth === 'down' && <img src={down} alt='up' style={{width: 20, paddingLeft: 3}}/>}</div>
          </div>
        </div>
      </div>
    </Card >
  );
};

export default CardDashboard;
