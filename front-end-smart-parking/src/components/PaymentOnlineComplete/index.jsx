import paymentSuccess from '@image/payment-success.png';
import depositFail from '@image/close.png';
import './style.css';

const PaymentOnlineComplete = ({success}) => {
  return (
    <div className='payment-online-complete'>
      <div className='icon'>
        {success ? <img src={paymentSuccess} alt="icon-success" className='scale-effect' /> : <img src={depositFail} alt="icon-fail" className='scale-effect' />}
      </div>
      {success ? <h1>Thanh toán thành công</h1> : <h1>Thanh toán thất bại</h1>}
    </div>
  );
};

export default PaymentOnlineComplete;