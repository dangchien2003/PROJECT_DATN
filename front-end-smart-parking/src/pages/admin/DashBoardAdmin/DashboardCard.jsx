import React, { useEffect, useState } from 'react'
import CardDashboard from '@/components/CardDashboard'
import doanhThu from '@image/doanh_thu.png'
import ticket2 from '@image/ticket2.png'
import ticket from '@image/ticket.png'
import account from '@image/account.png'
import location from '@image/location.png'
import deposit from '@image/deposit.png'
import { Space } from 'antd'
import DoubleCardDashboard from '@/components/DoubleCardDashboard'
import { getStatisticalCardAtHomeByAdmin } from '@/service/statisticalService'
import { getDataApi } from '@/utils/api'
import { toastError } from '@/utils/toast'
import { formatCurrency } from '@/utils/number'

const DashboardCard = () => {
  const [data ,setData] = useState({});
  useEffect(() => {
    getStatisticalCardAtHomeByAdmin().then(response => {
      const result = getDataApi(response);
      setData(result);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div style={{ padding: 36, paddingBottom: 50 }}>
      <Space style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Space direction='vertical' size="middle" >
          <CardDashboard label="Doanh thu tháng" value={`${data.doanhThu?.[0].value ? formatCurrency(data.doanhThu[0].value) : 0} đ`} icon={(<img src={doanhThu} style={{ width: 40 }} alt="Doanh thu tháng"/>)} borderColor='#f6a621' growth={data.doanhThu?.[0]?.growth ? "up" : "down"}/>
          <DoubleCardDashboard label="Tài khoản" value={{title1: 'Khách hàng', value1: data.taiKhoan?.[0].value ? formatCurrency(data.taiKhoan[0].value) : 0, title2: 'Đối tác', value2: data.taiKhoan?.[1].value ? formatCurrency(data.taiKhoan[1].value) : 0}} icon={account} borderColor='#f6a621' />
        </Space>
        <Space direction='vertical' size="middle">
          <CardDashboard label="Vé đã bán" value={`${data.veDaBan?.[0].value ? formatCurrency(data.veDaBan[0].value) : 0}`} icon={(<img src={ticket2} style={{ width: 40 }} alt="Vé đã bán"/>)} borderColor='#00C49F' growth={data.veDaBan?.[0]?.growth ? "up" : "down"}/>
          <DoubleCardDashboard label="Vé đã tạo" value={{title1: 'Đang lưu hành', value1: data.veDaTao?.[0].value ? formatCurrency(data.veDaTao[0].value) : 0, title2: 'Tổng số', value2: data.veDaTao?.[1].value ? formatCurrency(data.veDaTao[1].value) : 0}} icon={ticket} borderColor='#00C49F' />
        </Space>
        <Space direction='vertical' size="middle">
          <CardDashboard label="Số tiền nạp" value={`${data.soTienNap?.[0].value ? formatCurrency(data.soTienNap[0].value) : 0} đ`}  icon={(<img src={deposit} style={{ width: 40 }} alt="Dòng tiền vào"/>)} borderColor='#FF8042' />
          <DoubleCardDashboard label="Điểm đỗ" value={{title1: 'Đang lưu hành', value1: data.diemDo?.[0].value ? formatCurrency(data.diemDo[0].value) : 0, title2: 'Tổng số', value2: data.diemDo?.[1].value ? formatCurrency(data.diemDo[1].value) : 0}} icon={location} borderColor='#FF8042' />
        </Space>
      </Space>
    </div>
  )
}

export default DashboardCard
