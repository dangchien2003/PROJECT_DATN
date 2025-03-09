import { Dropdown, Space, Switch } from 'antd'
import React, { useState } from 'react'
import { MoreOutlined } from '@ant-design/icons';
import PopConfirmCustom from '../PopConfirmCustom';

const TitleItemCard = ({isAdmin}) => {
  const [open, setOpen] = useState(false);
  const [openKVV, setOpenKVV] = useState(false);
  const [openPopConfirm, setOpenPopConfirm] = useState(false);
  const [openPopConfirmKVV, setOpenPopConfirmKVV] = useState(false);
  // handle
  const handleChangeOpen = () => {
    setOpenPopConfirm(true);
  }
  const handleChangeKVV = (checked) => {
    if (checked) {
      setOpenPopConfirmKVV(true);
    }
  }
  // tạm khoá
  const handleOk = () => {
    setOpen(pre => !pre);
    setOpenPopConfirm(false);
  };
  const handleCancel = () => {
    setOpenPopConfirm(false);
  };
  // khoá vĩnh viễn
  const handleOkKVV = () => {
    setOpenKVV(pre => !pre);
    setOpenPopConfirmKVV(false);
  };
  const handleCancelKVV = () => {
    setOpenPopConfirmKVV(false);
  };
  // option
  const items = [
    {
      label: (
        <div>Tạm khoá: <Switch
          onChange={handleChangeOpen}
          checked={open}
          disabled={openKVV}
          style={{
            margin: 16,
          }}
        /></div>
      ),
      key: '0',
      onClick: (e) => {
        e.domEvent.preventDefault();
      }
    },
    {
      label: (
        <div>Khoá vĩnh viễn: <Switch
          onChange={handleChangeKVV}
          checked={openKVV}
          disabled={openKVV}
          style={{
            margin: 16,
          }}
        /></div>
      ),
      key: '1',
    }
  ];
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>
        THẺ TỰ LIÊN KẾT
      </span>
      {!isAdmin && 
      <>
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
        >
          <a href='/#' onClick={(e) => e.preventDefault()}>
            <Space>
              <MoreOutlined style={{ fontSize: 25, color: 'white' }} />
            </Space>
          </a>
        </Dropdown>
        {openPopConfirm && (open ? <PopConfirmCustom type="warning" title="Bạn có chắc chắn muốn tiếp tục sử dụng không?" message="Thẻ sẽ hoạt động bình thường sau khi nhấn đồng ý." handleCancel={handleCancel} handleOk={handleOk} /> : <PopConfirmCustom type="warning" title="Bạn có chắc chắn muốn tạm khoá không?" message="Bạn vẫn có thể mở lại trong vòng 1 giớ tới." handleCancel={handleCancel} handleOk={handleOk} />)}
        {openPopConfirmKVV && (!openKVV && <PopConfirmCustom type="warning" title="Bạn có chắc chắn muốn khoá thẻ vĩnh viễn không?" message="Bạn sẽ không thể mở lại sau khi nhấn đồng ý." handleCancel={handleCancelKVV} handleOk={handleOkKVV} />)}
      </>
      }
    </div>
  )
}

export default TitleItemCard
