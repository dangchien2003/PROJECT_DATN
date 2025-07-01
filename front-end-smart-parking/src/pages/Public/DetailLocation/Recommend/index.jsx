import { Link } from 'react-router-dom';
import TicketCardMinimize from '../../ChooseTicket/TicketCardMinimize';
import './style.css'
import { useEffect, useState } from 'react';
import { getDataApi } from '@/utils/api';
import { toastError } from '@/utils/toast';
import LoadingComponent from '@/components/LoadingComponent';
import { customerSearch } from '@/service/ticketService';
import { Empty } from 'antd';

const Recommend = ({ id }) => {
  const [loadding, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadData = () => {
    setData([]);
    setLoading(true);
    const dataSearch = {
      locationId: id,
    }
    customerSearch(dataSearch, 0, 5)
      .then((response) => {
        const data = getDataApi(response);
        setData(
          data
        );
      })
      .catch((error) => {
        error = getDataApi(error);
        toastError(error.message)
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  return (
    <div className='recomment-wrapper br3 pr'>
      {loadding && <LoadingComponent transparent />}
      {
        (!loadding && data !== null && data.length > 0) &&
        <>
          <div className='view-all'>
            <Link className='no-style hover' to={"/choose/ticket/1"}>{">> "}Xem tất cả</Link>
          </div>
          <div className='recommend'>
            {
              data.map(item => {
                return <TicketCardMinimize data={item} />
              })
            }
          </div>
        </>
      }
      {
        (!loadding && data.length === 0) && <Empty description="Không tìm thấy gợi ý" className='empty' />
      }
    </div>
  );
};

export default Recommend;