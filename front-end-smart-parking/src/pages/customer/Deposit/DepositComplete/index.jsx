import depositSuccess from '@image/deposit.png';
import depositFail from '@image/close.png'
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './style.css';

const DepositComplete = ({success}) => {
  return (
    <div className='deposit-complete'>
      <div className='icon'>
        {success ? <img src={depositSuccess} alt="icon-success" className='scale-effect' /> : <img src={depositFail} alt="icon-fail" className='scale-effect' />}
      </div>
      {success ? <h1>Nạp tiền thành công</h1> : <h1>Nạp tiền thất bại</h1>}
      {success && <Link to={"/choose/location"}>
        <Button type='primary' variant='solid'>
          Đi mua vé
        </Button>
      </Link>}
    </div>
  );
};

export default DepositComplete;