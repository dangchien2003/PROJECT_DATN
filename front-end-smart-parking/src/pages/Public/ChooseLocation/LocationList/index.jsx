import LoadingComponent from '@/components/LoadingComponent'
import { customerSearch } from '@/service/locationService'
import { setSearching } from '@/store/startSearchSlice'
import { getDataApi } from '@/utils/api'
import { toastError } from '@/utils/toast'
import { Empty, Flex, Pagination } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LocationCard from './LocationCard'
const LocationList = ({ dataSearch }) => {
  const dispatch = useDispatch();
  const { isSearching } = useSelector(state => state.startSearch);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [firstSearch, setFirstSearch] = useState(false);
  const [data, setData] = useState([]);

  const loadData = (newPagination) => {
    setData([]);
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
        dispatch(setSearching(false));
        setFirstSearch(true);
      });
  };

  useEffect(() => {
    if (isSearching || !firstSearch) {
      // reset page
      const page = {
        current: 1,
        pageSize: 5,
        total: 0,
      }
      loadData(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching]);

  const handleChangePage = (page) => {
    pagination.current = page;
    loadData(pagination);
  }
  return (
    <div className='location-list'>
      <div className="pr">
        {/* loading */}
        {(isSearching || !firstSearch) && <LoadingComponent transparent />}
        {/* render kết quả */}
        {(!isSearching || !firstSearch) &&
          data.map(item => <LocationCard data={item} />)
        }
        {/* Hiển thị khi không có kết quả */}
        {(!isSearching && firstSearch && data?.length === 0) && <Empty description="Không tìm thấy dữ liệu phù hợp" />}
      </div>
      {/* Không phân trang khi không có dữ liệu */}
      {(data?.length > 0 && !isSearching) && <Flex justify='end'>
        <Pagination
          defaultCurrent={pagination.current}
          total={pagination.total}
          pageSize={pagination.pageSize}
          showSizeChanger={false}
          onChange={handleChangePage} />
      </Flex>}

    </div>
  )
}

export default LocationList
