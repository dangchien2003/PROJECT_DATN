import ChildContent from '@/components/layout/Customer/ChildContent';
import './style.css'
import StepOrder from '@/pages/customer/OrderTicket/StepOrder';
import { Col, Row } from 'antd';
import vnpay from "@image/vnpay.png"
import bank from "@image/bank.png"
import remaining from "@image/remaining.png"
import PopConfirmCustom from '@/components/PopConfirmCustom';
import { useState } from 'react';
import { toastError } from '@/utils/toast';

const Payment = () => {
  const [confirmRemaing, setConfirmRemaining] = useState(false);

  const handleClickMothod = (id) => {
    switch(id) {
      case 1: 
        break;
      case 2: 
        break;
      case 3: 
        onPayRemaining();
        break;
      default:
        toastError("Phương thức không xác định");
    }
  }

  const onPayRemaining = () => {
    setConfirmRemaining(true)
  }

  const onCancelPopup = () => {
    setConfirmRemaining(false);
  }

  return (
    <div className='payment'>
      <ChildContent>
        <StepOrder current={2} />
      </ChildContent>
      <ChildContent className='padding-footer'>
        <h2>Chọn hình thức thanh toán</h2>
        <Row gutter={16}>
          <Col lg={8} md={24}>
            <div className='payment-method'>
              <div className='img-wrapper'>
                <img src={vnpay} alt="vnpay" onClick={() => { handleClickMothod(1) }} />
              </div>
              <div className='description-method'>Bạn sẽ được dẫn tới cổng thanh toán của VNPAY sau khi nhấn vào biểu tượng trên. Sau đó thực hiện thanh toán qua các phương thức VNPAY cung cấp.</div>
            </div>
          </Col>
          <Col lg={8} md={24} >
            <div className='payment-method'>
              <div className='img-wrapper'>
                <img src={bank} alt="vnpay" onClick={() => { handleClickMothod(2) }} />
              </div>
              <div className='description-method'>Bạn sẽ được dẫn tới trang thanh toán sau khi nhấn vào biểu tượng trên, sau đó tiến thành quét mã QR để thực hiện thanh toán.</div></div>
          </Col>
          <Col lg={8} md={24} >
            <div className='payment-method'>
              <div className='img-wrapper'>
                <img src={remaining} alt="vnpay" onClick={() => { handleClickMothod(3) }} />
              </div>
              <div className='description-method'>Số tiền thanh toán được trừ trực tiếp vào số dư tài khoản của bạn. Không thể thanh toán nếu số dư không đủ.</div></div>
          </Col>
        </Row>
      </ChildContent>
      {confirmRemaing && <PopConfirmCustom title={"Bạn có chắc chắn muốn thanh toán bằng số dư không?"} handleCancel={onCancelPopup} type={"warning"}/>}
    </div>
  );
};

export default Payment;