import iconSuccess from '@image/payment-success.png';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './style.css';

const PaymentSuccess = () => {
  return (
    <div className='payment-success'>
      <div className='icon'>
        <img src={iconSuccess} alt="icon-success scale-effect" />
      </div>
      <h1>Thanh toán thành công</h1>
      <Link to={"/list/ticket"}>
        <Button type='primary' variant='solid'>
          Xem danh sách vé
        </Button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;