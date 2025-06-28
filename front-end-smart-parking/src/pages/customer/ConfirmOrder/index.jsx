import ChildContent from '@/components/layout/Customer/ChildContent';
import { getCookie } from '@/utils/cookie';
import logo from '@image/logo_parking.png';
import { Button, Col, Flex, Row } from 'antd';
import { useEffect, useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { IoTicket, IoWarning } from 'react-icons/io5';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StepOrder from '../OrderTicket/StepOrder';
import ItemBill from './ItemBill';
import './style.css';

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState({});

  useEffect(() => {
    const order = getCookie("order");
    if(order)
    try {
      const data = JSON.parse(order);
      setOrderInfo(data);
    } catch(e) {
      navigate("/404")
    }
}, [])

const handleNext = () => {
  navigate("/payment/1");
}

return (
  <div className='confirm-order'>
    <ChildContent backgroundColor='#f0f0f0'>
      <StepOrder current={1} />
    </ChildContent>
    <ChildContent backgroundColor='#f0f0f0' className='padding-footer'>
      <Row gutter={16}>
        <Col lg={16} md={24} className='item-col'>
          <div>
            <div className='title-box br3'>Thông tin tổng quan</div>
            <div className='content-box bw br3 pr0'>
              <div className='item-info'>
                <span className='label-name'><IoTicket className='icon' />Bạn đang mua vé: </span>
                <span className='value-label'><b>{orderInfo.ticketName}</b></span>
              </div>
              <div className='item-info'>
                <div className='child'>
                  <span className='label-name'><FaLocationDot className="icon" />Sử dụng cho địa điểm: </span>
                  <span className='value-label'><b>{orderInfo.locationName}</b></span>
                </div>
                <div>
                  <span className='label-name'><span className='icon empty'></span>Địa chỉ: </span>
                  <span className='value-label'><b>{orderInfo.address}</b></span>
                </div>
              </div>
              <div className='item-info'>
                <span className='label-name'><MdOutlineAccessTimeFilled className='icon' />Hạn sử dụng: </span>
                <span className='value-label'>Từ <b>{orderInfo.startTime}</b> đến <b>{orderInfo.endTime}</b></span>
              </div>
              <div className='item-info break owner'>
                <span className='label-name'><FaUserAlt className="icon" />Chủ sở hữu: </span>
                {
                  orderInfo.owner?.length > 0 ?
                  <>
                  <p className='warning child'><IoWarning className='icon warning' /> Người dùng dưới đây sẽ được toàn quyền sử dụng mọi chức năng với vé được mua hộ</p>
                  <span className='value-label'>
                    <ol>
                      {orderInfo.owner.map((item, index) => <li key={index}>{item.email} - <b>{item.fullName}</b></li>)}
                    </ol>
                  </span>
                  </> 
                  : <span><b>Tài khoản hiện tại</b></span>
                }
              </div>
            </div>
          </div>
        </Col>
        <Col lg={8} md={24}>
          <div>
            <div className='title-box br3'>Đơn giá</div>
            <div className='content-box bw br3 bill'>
              <Flex justify='center'>
                <img src={logo} alt="logo" className='logo' />
              </Flex>
              <h2 className='build-title'>Hoá đơn thanh toán</h2>
              <ItemBill label={"Thời gian"} value={"11/11/2025 11:11"} />
              <ItemBill label={"Người thanh toán"} value={"Lê Đăng Chiến"} />
              <ItemBill label={"Email"} value={"chienboy03@gmail.com"} />
              <ItemBill label={"Hạn từ"} value={"11/11/2025 12:00"} />
              <ItemBill label={"Đến"} value={"12/11/2025 12:00"} />
              <ItemBill label={"Số lượng"} value={"10"} />
              <ItemBill label={"Đơn giá"} value={<span>20.000<sup>Đ</sup></span>} />
              <div className='total'>
                <ItemBill label={"Thành tiền"} value={<span>200.000<sup>Đ</sup></span>} />
              </div>
              <div className='action'>
                <Button onClick={handleNext} color="primary" variant="solid">Thực hiện thanh toán</Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </ChildContent>
  </div>
);
};

export default ConfirmOrder;