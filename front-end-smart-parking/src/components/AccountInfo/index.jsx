import { Flex, Tooltip } from 'antd';
import { MdEdit } from 'react-icons/md';
import Info from './Info';
import './style.css';
import { useEffect, useState } from 'react';
import { getInfoAccount } from '@/service/accountService';
import { getDataApi } from '@/utils/api';
import { toastError } from '@/utils/toast';
import noAvatar from '@image/no_avatar.png'
import { ACCOUNT_CATEGORY } from '@/utils/constants';

const AccountInfo = () => {
  const [info, setInfo] = useState({});
  useEffect(() => {
    getInfoAccount().then(response => {
      const data = getDataApi(response);
      setInfo(data);
    })
      .catch(e => {
        const response = getDataApi(e);
        toastError(response.message);
      }).finally(() => {

      })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div className='account-info'>
      <div className="head">
        <Flex justify='center' className='avatar'>
          <div className='pr'>
            <img src={info.avatar || noAvatar} alt="avatar" />
            <Tooltip title="Thay đổi ảnh đại diện">
              <div className='pa edit-avatar pointer'>
                <MdEdit />
              </div>
            </Tooltip>
          </div>
        </Flex>
        {/* <div className='detail-item end remaining'>
          <div className='label'>
            Số dư:
          </div>
          <div className='value'>
            80.000<sup>Đ</sup>
          </div>
        </div> */}
        <div className='detail-item end remaining'>
          <div className='label'>
            Tài khoản:
          </div>
          <div className='value'>
            {info.category === ACCOUNT_CATEGORY.CUSTOMER && "Khách hàng"}
            {info.category === ACCOUNT_CATEGORY.PARTNER && "Đối tác"}
            {info.category === ACCOUNT_CATEGORY.ADMIN && "Quản trị"}
          </div>
        </div>
      </div>
      <Info info={info}/>
    </div>
  );
};

export default AccountInfo;