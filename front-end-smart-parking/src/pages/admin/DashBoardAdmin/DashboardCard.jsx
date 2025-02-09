import React from 'react'
import CardDashboard from '@/components/CardDashboard'
import doanhThu from '@image/doanh_thu.png'
import ticket2 from '@image/ticket2.png'
import ticket from '@image/ticket.png'
import account from '@image/account.png'
import location from '@image/location.png'
import deposit from '@image/deposit.png'
import { Space } from 'antd'
import DoubleCardDashboard from '@/components/DoubleCardDashboard'

const DashboardCard = () => {
  return (
    <div style={{ padding: 36, paddingBottom: 50 }}>
      <Space style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Space direction='vertical' size="middle" >
          <CardDashboard label="Doanh thu tháng" value={"1.000.000.000 đ"} icon={(<img src={doanhThu} style={{ width: 40 }} alt="Doanh thu tháng"/>)} borderColor='#f6a621' growth='down'/>
          <DoubleCardDashboard label="Tài khoản" value={{title1: 'Khách hàng', value1: '100.000', title2: 'Đối tác', value2: '50'}} icon={account} borderColor='#f6a621' />
        </Space>
        <Space direction='vertical' size="middle">
          <CardDashboard label="Vé đã bán" value={"100.000"} icon={(<img src={ticket2} style={{ width: 40 }} alt="Vé đã bán"/>)} borderColor='#00C49F' growth='up'/>
          <DoubleCardDashboard label="Vé đã tạo" value={{title1: 'Đang lưu hành', value1: '100.000', title2: 'Tổng số', value2: '50'}} icon={ticket} borderColor='#00C49F' />
        </Space>
        <Space direction='vertical' size="middle">
          <CardDashboard label="Dòng tiền vào" value={"200.000.000 đ"} icon={(<img src={deposit} style={{ width: 40 }} alt="Dòng tiền vào"/>)} borderColor='#FF8042' />
          <DoubleCardDashboard label="Điểm đỗ" value={{title1: 'Đang lưu hành', value1: '100.000', title2: 'Tổng số', value2: '50'}} icon={location} borderColor='#FF8042' />
        </Space>
      </Space>
    </div>
  )
}

export default DashboardCard
