import ChildContent from '@/components/layout/Customer/ChildContent'
import LoadingComponent from '@/components/LoadingComponent'
import { customerSearch } from '@/service/ticketService'
import { getDataApi } from '@/utils/api'
import { toastError } from '@/utils/toast'
import { Empty, Flex, Pagination, Radio, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { CiUndo } from "react-icons/ci"
import { FaCar, FaMotorcycle } from 'react-icons/fa6'
import { useParams, useSearchParams } from 'react-router-dom'
import './style.css'
import TicketCard from './TicketCard'

const ChooseTicket = () => {
  const [searchParams] = useSearchParams();
  const { locationId } = useParams();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loadding, setLoading] = useState(false);
  const [idTimeOut, setIdTimeOut] = useState(null);
  const [category, setCategory] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [data, setData] = useState([]);

  const loadData = (newPagination) => {
    setData([]);
    setLoading(true);
    const dataSearch = {
      locationId,
      ticketCategory: category,
      vehicle: vehicle
    }
    customerSearch(dataSearch, newPagination.current - 1, newPagination.pageSize)
      .then((response) => {
        const data = getDataApi(response);
        const total = response.data?.result?.totalElements;
        setData(
          data
        );
        setPagination({
          ...newPagination,
          total: total,
        });
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
    if (idTimeOut) {
      clearTimeout(idTimeOut);
    }
    setLoading(true);
    setData([]);
    const timeOut = setTimeout(() => {
      // reset page
      const page = {
        current: 1,
        pageSize: 5,
        total: 0,
      }
      loadData(page);
    }, 1000);
    setIdTimeOut(timeOut);
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [category, vehicle]);

  const handleChangePage = (page) => {
    pagination.current = page;
    loadData(pagination);
  }

  const handleChangeCategory = (e) => {
    const value = e.target.value;
    setCategory(value);
  }

  const handleClearCategory = () => {
    setCategory(null);
  }

  const handleChangeVehicle = (e) => {
    const value = e.target.value;
    setVehicle(value);
  }

  const handleClearVehicle = () => {
    setVehicle(null);
  }

  return (
    <div id='choose-ticket'>
      <ChildContent>
        <h2 className='page-name'>Chọn vé</h2>
        <div className='head'>
          <div className='location-name'>{searchParams.get("name")}
          </div>
          <div className='publisher'>{searchParams.get("partner")}</div>
          <Flex justify='center'>
            <Radio.Group
              onChange={handleChangeCategory}
              value={category}
              options={[
                { value: 1, label: 'Vé giờ' },
                { value: 2, label: 'Vé ngày' },
                { value: 3, label: 'Vé tuần' },
                { value: 4, label: 'Vé tháng' },
              ]}
            />
            <div className='clear'>
              <Tooltip title="Đặt lại">
                <CiUndo onClick={handleClearCategory} />
              </Tooltip>
            </div>
          </Flex>
          <Flex justify='center' style={{ paddingTop: 8 }}>
            <Radio.Group
              onChange={handleChangeVehicle}
              value={vehicle}
              options={[
                {
                  value: 0, label:
                    <span>
                      <Tooltip title="Xe máy">
                        <FaMotorcycle />
                      </Tooltip>
                    </span>
                },
                {
                  value: 1, label:
                    <span>
                      <Tooltip title="Ô tô">
                        <FaCar />
                      </Tooltip>
                    </span>
                },
                {
                  value: 2, label:
                    <span>
                      <Tooltip title="Hỗn hợp">
                        <FaMotorcycle style={{ marginRight: 4 }} />
                        <FaCar />
                      </Tooltip>
                    </span>
                },
              ]}
            />
            <div className='clear'>
              <Tooltip title="Đặt lại">
                <CiUndo onClick={handleClearVehicle} />
              </Tooltip>
            </div>
          </Flex>
        </div>
      </ChildContent>
      <ChildContent backgroundColor='rgb(250, 250, 250)' className='parent-list-ticket pr'>
        {
          loadding && <LoadingComponent transparent />
        }
        <div className='list-card'>
          {
            data.map(item => <TicketCard data={item} />)
          }
          {
            (!loadding && (data === null || data.length === 0)) && <Empty description="Không tìm thấy dữ liệu phù hợp"/>
          }
        </div>
        {(!loadding && data.length > 0) && <Flex justify='center'>
          <Pagination
            defaultCurrent={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            showSizeChanger={false}
            onChange={handleChangePage} />
        </Flex>}
      </ChildContent>
    </div>
  )
}

export default ChooseTicket
