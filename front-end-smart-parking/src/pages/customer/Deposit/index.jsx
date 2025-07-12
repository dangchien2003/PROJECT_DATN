import ChildContent from '@/components/layout/Customer/ChildContent';
import ModalCustom from '@/components/ModalCustom';
import { useLoading } from '@/hook/loading';
import { requestDeposit } from '@/service/depositService';
import { getDataApi } from '@/utils/api';
import { lineLoading } from '@/utils/constants';
import { formatCurrency, parseFormattedCurrency } from '@/utils/number';
import { toastError } from '@/utils/toast';
import bank from "@image/bank-icon.png";
import { Button, Flex, Input } from 'antd';
import { useEffect, useState } from 'react';
import { TiWarning } from "react-icons/ti";
import { useSearchParams } from 'react-router-dom';
import History from './History';
import ItemMethod from './ItemMethod';
import ItemRecommend from './ItemRecommend';
import './style.css';
import DepositComplete from './DepositComplete';

const Deposit = () => {
  const [depositSuccess, setDepositSuccess] = useState(null);
  const [method, setMethod] = useState(null);
  const [numberCoin, setNumberCoin] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const { showLoad, hideLoad } = useLoading();
  const keyRequesting = "deposit_requesting";
  const [param] = useSearchParams();

  useEffect(() => {
    if(param.get("vnp_TransactionStatus")) {
      const depositRequestingSto = localStorage.getItem(keyRequesting);
      if(depositRequestingSto === "1" && param.get("vnp_TransactionStatus") === "00") {
        setDepositSuccess(true);
      } else if(depositRequestingSto === "1" && param.get("vnp_TransactionStatus") !== "00") {
        setDepositSuccess(false);
      }
    }
    localStorage.removeItem(keyRequesting);
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

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

  const handleCloseModal = () => {
    setShowHistory(false);
    setDepositSuccess(null);
  }

  const handleDepositRequest = () => {
    const payload = {
      total: numberCoin,
      paymentMethod: method
    }
    showLoad(lineLoading);
    requestDeposit(payload).then((response) => {
      const data = getDataApi(response);
      localStorage.setItem(keyRequesting, 1);
      window.location.href = data.urlRedirect;
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
            <ItemRecommend coin={20000} onClick={handleClickRecommend} current={numberCoin} />
            <ItemRecommend coin={50000} onClick={handleClickRecommend} current={numberCoin} />
            <ItemRecommend coin={100000} onClick={handleClickRecommend} current={numberCoin} />
            <ItemRecommend coin={200000} onClick={handleClickRecommend} current={numberCoin} />
            <ItemRecommend coin={500000} onClick={handleClickRecommend} current={numberCoin} />
            <ItemRecommend coin={1000000} onClick={handleClickRecommend} current={numberCoin} />
          </Flex>
          <div className="input-coin space-box">
            <h3>
              Số tiền nạp
            </h3>
            <Input className='number-coin' value={formatCurrency(numberCoin)} placeholder='Nhập số tiền tối thiểu 10.000' onChange={handleChangeCoin} />
          </div>
          <div className="method-box space-box">
            {/* <div>
              <b>Chọn phương thức thanh toán</b>
            </div> */}
            <h3>Phương thức thanh toán</h3>
            <ItemMethod icon={"https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"} name={"Thanh toán VNPAY"} method={"vnpay"} value={1} choosed={method} onClick={handleClickMethod} />
            <ItemMethod icon={bank} name={"Thanh toán ngân hàng"} method={"bank"} value={2} choosed={method} onClick={handleClickMethod} />
          </div>
          <div className="action">
            <Button variant='solid' type='primary' onClick={handleDepositRequest} disabled={(!numberCoin || numberCoin < 10000 || !method)}>THỰC HIỆN</Button>
            {/* cảnh báo lỗi */}
            {(!numberCoin || numberCoin < 10000 || !method) && <div style={{ fontSize: 15, padding: 4, color: "red" }}>Vui lòng nhập số tiền nạp lớn hơn 10.000đ và chọn phương thức thanh toán để tiếp tục thực hiện</div>}
          </div>
        </div>
      </ChildContent>
      {showHistory && <ModalCustom onClose={handleCloseModal}>
        <History />
      </ModalCustom>}
      {depositSuccess !== null && <ModalCustom onClose={handleCloseModal}>
        <DepositComplete success={depositSuccess}/>
      </ModalCustom>}
    </div>
  );
};

export default Deposit;