import ChildContent from '@/components/layout/Customer/ChildContent';
import ModalCustom from '@/components/ModalCustom';
import PopConfirmCustom from '@/components/PopConfirmCustom';
import { useLoading } from '@/hook/loading';
import StepOrder from '@/pages/customer/OrderTicket/StepOrder';
import { confirmOrder } from '@/service/orderService';
import { minusRemaining } from '@/store/remainingSlice';
import { getDataApi } from '@/utils/api';
import { lineLoading } from '@/utils/constants';
import { deleteCookie, getCookie } from '@/utils/cookie';
import { formatCurrency } from '@/utils/number';
import { toastError } from '@/utils/toast';
// import bank from "@image/bank.png";
import remainingImg from "@image/remaining.png";
import vnpay from "@image/vnpay.png";
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PaymentSuccess from './PaymentSuccess';
import './style.css';

const Payment = () => {
  const [confirmRemaing, setConfirmRemaining] = useState(false);
  const [dataConfirm, setDataConfirm] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const remaining = useSelector(state => state.remaining);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showLoad, hideLoad } = useLoading();

  useEffect(() => {
    const data = getCookie('confirm');
    if (!data) navigate("/404");
    setDataConfirm(JSON.parse(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleClickMothod = (method) => {
    switch (method) {
      case 0:
        onPayRemaining();
        break;
      case 1:
        handleAgreePayment(method);
        break;
      // case 2:
      //   handleAgreePayment(method);
      //   break;
      default:
        toastError("Phương thức không xác định");
    }
  }

  const onPayRemaining = () => {
    setConfirmRemaining(true)
  }

  const handleCancelPopup = () => {
    setConfirmRemaining(false);
  }

  const handleAgreePayment = (method) => {
    // kiểm tra số dư
    if (method === 0) {
      if (remaining < dataConfirm.total) {
        toastError("Số dư không đủ");
        return;
      }
    }

    showLoad(lineLoading);

    const dataRequest = {
      orderId: dataConfirm.orderId,
      paymentMethod: method
    }
    confirmOrder(dataRequest).then(response => {
      if(method === 0) {
        dispatch(minusRemaining(dataConfirm.total))
        setConfirmRemaining(false);
        setPaymentSuccess(true);
      } else {
        // chuyển hướng khi thanh toán online
        const result = getDataApi(response);
        if(result.urlRedirect) {
          window.location.href = result.urlRedirect;
        }
        localStorage.setItem("wait_payment_ticket", 1)
      }
      deleteCookie("order");
      deleteCookie("confirm");
    })
      .catch(e => {
        const response = getDataApi(e);
        toastError(response.message);
      })
      .finally(() => {
        hideLoad();
      })
  }

  return (
    <div className='payment'>
      <ChildContent>
        <StepOrder current={2} />
      </ChildContent>
      <ChildContent className='padding-footer'>
        <h2>Chọn hình thức thanh toán</h2>
        <Row gutter={16}>
          <Col lg={12} md={24}>
            <div className='payment-method'>
              <div className='img-wrapper'>
                <img src={remainingImg} alt="remaining" onClick={() => { handleClickMothod(0) }} />
              </div>
              <div className='description-method'>Số tiền thanh toán được trừ trực tiếp vào số dư tài khoản của bạn. Không thể thanh toán nếu số dư không đủ.</div>
            </div>
          </Col>
          <Col lg={12} md={24}>
            <div className='payment-method'>
              <div className='img-wrapper'>
                <img src={vnpay} alt="vnpay" onClick={() => { handleClickMothod(1) }} />
              </div>
              <div className='description-method'>Bạn sẽ được dẫn tới cổng thanh toán của VNPAY sau khi nhấn vào biểu tượng trên. Sau đó thực hiện thanh toán qua các phương thức VNPAY cung cấp.</div>
            </div>
          </Col>
          {/* 
          <Col lg={8} md={24} >
            <div className='payment-method di'>
              <div className='img-wrapper'>
                <img src={bank} alt="bank" onClick={() => { handleClickMothod(2) }} className='disable'/>
              </div>
              <div className='description-method'>Bạn sẽ được dẫn tới trang thanh toán sau khi nhấn vào biểu tượng trên, sau đó tiến thành quét mã QR để thực hiện thanh toán.</div>
            </div>
          </Col>
          */}
        </Row>
      </ChildContent>
      {confirmRemaing && <PopConfirmCustom title={"Bạn có chắc chắn muốn thanh toán bằng số dư không?"}
        message={`Số tiền bạn sẽ thanh toán là ${formatCurrency(dataConfirm.total)} Đ`}
        handleCancel={handleCancelPopup} handleOk={() => {handleAgreePayment(0)}} type={"warning"} />}
      {paymentSuccess && <ModalCustom close={false}>
        <PaymentSuccess />
      </ModalCustom>}
    </div>
  );
};

export default Payment;