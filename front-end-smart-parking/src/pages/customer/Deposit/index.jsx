import ChildContent from '@/components/layout/Customer/ChildContent';
import { TiWarning } from "react-icons/ti";
import './style.css'
import ItemRecommend from './ItemRecommend';
import { Button, Flex, Input } from 'antd';
import ItemMethod from './ItemMethod';
import bank from "@image/bank-icon.png"
import { useState } from 'react';
import { formatCurrency, parseFormattedCurrency } from '@/utils/number';
import ModalCustom from '@/components/ModalCustom';
import History from './History';

const Deposit = () => {
  const [method, setMethod] = useState(null);
  const [numberCoin, setNumberCoin] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleClickMethod = (value) => {
    setMethod(value);
  }

  const handleClickRecommend = (value) => {
    setNumberCoin(value);
  }
 
  const handleChangeCoin = (e) => {
    setNumberCoin(parseFormattedCurrency(e.target.value));
  }

  const handleClickHistory = () => {
    setShowHistory(true);
  }

  const handleCloseHistory = () => {
    setShowHistory(false);
  }

  return (
    <div className='deposit'>
      <ChildContent>
        <h2 className='page-name'>Nạp tiền</h2>
        <div className="space-left-content-page">
          <div className='history'>
            <span className='space-box' onClick={handleClickHistory}>Lịch sử nạp</span>
            </div>
          <div className="warning space-box">
            <h3><TiWarning /> Cảnh báo</h3>
            <p className="content-warning cb">
              Mọi hành động cố ý lợi dụng lỗ hổng để trục lợi cho bản thân, chúng tôi sẽ có toàn quyền thu hồi số tiền và nặng hơn có thể khoá tài khoản vĩnh viễn không hoàn lại số tiền còn dư.
            </p>
          </div>
          <Flex className="recommend space-box" gap={16} wrap="wrap">
            <ItemRecommend coin={20000} onClick={handleClickRecommend} current={numberCoin}/>
            <ItemRecommend coin={50000} onClick={handleClickRecommend} current={numberCoin}/>
            <ItemRecommend coin={100000} onClick={handleClickRecommend} current={numberCoin}/>
            <ItemRecommend coin={200000} onClick={handleClickRecommend} current={numberCoin}/>
            <ItemRecommend coin={500000} onClick={handleClickRecommend} current={numberCoin}/>
            <ItemRecommend coin={1000000} onClick={handleClickRecommend} current={numberCoin}/>
          </Flex>
          <div className="input-coin space-box">
            <h3>
              Số tiền nạp
            </h3>
            <Input className='number-coin' value={formatCurrency(numberCoin)} placeholder='Nhập số tiền' onChange={handleChangeCoin}/>
          </div>
          <div className="method-box space-box">
            {/* <div>
              <b>Chọn phương thức thanh toán</b>
            </div> */}
            <h3>Phương thức thanh toán</h3>
            <ItemMethod icon={"https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"} name={"Thanh toán VNPAY"} method={"vnpay"} value={1} choosed={method} onClick={handleClickMethod}/>
            <ItemMethod icon={bank} name={"Thanh toán ngân hàng"} method={"bank"} value={2} choosed={method} onClick={handleClickMethod}/>
          </div>
          <div className="action">
            <Button variant='solid' type='primary'>THỰC HIỆN</Button>
          </div>
        </div>
      </ChildContent>
      {showHistory && <ModalCustom onClose={handleCloseHistory}>
          <History />
        </ModalCustom>}
    </div>
  );
};

export default Deposit;