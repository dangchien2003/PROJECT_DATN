import SkeletonShimmerLoading from '@/components/Loading/SkeletonShimmerLoading'
import { getBalance } from '@/service/accountService'
import { setRemaining } from '@/store/remainingSlice'
import { getDataApi } from '@/utils/api'
import { formatCurrency } from '@/utils/number'
import { toastError } from '@/utils/toast'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Remaining = () => {
  const remaining = useSelector(state => state.remaining);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    getBalance().then((response) => {
      const data = getDataApi(response);
      dispatch(setRemaining(data));
    })
    .catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    })
    .finally(() => {
      setLoading(false);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div class="remaining">
      <div className='label'>Số dư:</div>
      <div className='box-quantity'>
        {loading && <SkeletonShimmerLoading />}
        {!loading && <><span className='quantity'>
          <span>{remaining > 9999999 ? formatCurrency(9999999) : formatCurrency(remaining)}</span>
          {remaining > 9999999 && <span className='plus'>+</span>}
        </span>
        <span style={{paddingLeft: 8}}>Đ</span></>}
      </div>
    </div>
  )
}

export default Remaining
