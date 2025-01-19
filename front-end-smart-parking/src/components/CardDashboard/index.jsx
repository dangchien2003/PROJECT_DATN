import { Card } from 'antd';
import React from 'react';

const CardDashboard = ({ borderColor = "#f6a621", label, value, icon }) => {
  return (
    <Card
      style={{
        width: 250,
        height: 100,
        borderRadius: 8,
        border: '1px solid #f0f0f0',
        borderLeft: "8px solid " + borderColor,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      bodyStyle={{
        paddingBottom: 8,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'space-between'
      }}>
        {icon}
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <div style={{ marginLeft: '12px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
          </div>
        </div>
      </div>
    </Card >
  );
};

export default CardDashboard;
