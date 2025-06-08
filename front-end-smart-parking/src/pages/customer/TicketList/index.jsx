import ChildContent from '@/components/layout/Customer/ChildContent';
import './style.css'
import { Tabs } from 'antd';
import Search from './Search';
import TableList from './TableList';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearching } from '@/store/startSearchSlice';
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
    if(!isSearching) {
      dispatch(setSearching(true))
    }
  };
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
          <Search dataSearch={dataSearch}/>
          <div className='pt16'>
            <TableList dataSearch={dataSearch}/>
          </div>
        </ChildContent>
      </div>
    </div>
  );
};

export default TicketList;