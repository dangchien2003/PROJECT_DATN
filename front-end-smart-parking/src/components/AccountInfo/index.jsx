import { Flex, Tooltip } from 'antd';
import { MdEdit } from 'react-icons/md';
import Info from './Info';
import './style.css';

const AccountInfo = () => {
  return (
    <div className='account-info'>
      <div className="head">
        <Flex justify='center' className='avatar'>
          <div className='pr'>
            <img src="https://i0.wp.com/top10dienbien.com/wp-content/uploads/2022/10/avatar-cute-11.jpg?w=960&ssl=1" alt="avatar" />
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
            Đối tác
          </div>
        </div>
      </div>
      <Info/>
    </div>
  );
};

export default AccountInfo;