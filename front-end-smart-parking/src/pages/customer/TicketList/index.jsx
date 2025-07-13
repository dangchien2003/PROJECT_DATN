import ChildContent from '@/components/layout/Customer/ChildContent';
import './style.css'
import { Tabs } from 'antd';
import Search from './Search';
import TableList from './TableList';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearching } from '@/store/startSearchSlice';
import PaymentOnlineComplete from '@/components/PaymentOnlineComplete';
import { useSearchParams } from 'react-router-dom';
import ModalCustom from '@/components/ModalCustom';
const items = [
  {
    key: '1',
    label: 'Đang sử dụng',
  },
  {
    key: '2',
    label: 'Chưa sử dụng',
  },
  {
    key: '3',
    label: 'Đã bị huỷ',
  },
  {
    key: '4',
    label: 'Mua hộ',
  }
];
const TicketList = () => {
  const [buyTicketSuccess, setBuyTicketSuccess] = useState(null);
  const keyRequesting = "wait_payment_ticket";
  const [param] = useSearchParams();
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();

  const [dataSearch] = useState({
    tab: 1,
    locationName: null,
    buyDate: null,
    useDate: null
  });

  const onChangeTab = key => {
    dataSearch.tab = key;
    if (!isSearching) {
      dispatch(setSearching(true))
    }
  };

  // xử lý khi thanh toán vẻ online thành công
  useEffect(() => {
    if (param.get("vnp_TransactionStatus")) {
      const depositRequestingSto = localStorage.getItem(keyRequesting);
      if (depositRequestingSto === "1" && param.get("vnp_TransactionStatus") === "00") {
        setBuyTicketSuccess(true);
      } else if (depositRequestingSto === "1" && param.get("vnp_TransactionStatus") !== "00") {
        setBuyTicketSuccess(false);
      }
    }
    localStorage.removeItem(keyRequesting);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const handleCloseModal = () => {
    setBuyTicketSuccess(null);
  }

  return (
    <div className='ticket-list'>
      <ChildContent>
        <h2 className='page-name'>Danh sách vé</h2>
      </ChildContent>
      <div className="padding-content" >
        <ChildContent>
          <Tabs defaultActiveKey={dataSearch.tab} items={items} onChange={onChangeTab} />
        </ChildContent>
        <ChildContent>
          <Search dataSearch={dataSearch} />
          <div className='pt16'>
            <TableList dataSearch={dataSearch} />
          </div>
        </ChildContent>
      </div>
      {buyTicketSuccess !== null && <ModalCustom onClose={handleCloseModal}>
        <PaymentOnlineComplete success={buyTicketSuccess} />
      </ModalCustom>}
    </div>
  );
};

export default TicketList;