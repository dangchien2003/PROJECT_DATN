import { CARD_STATUS_2, lineLoading } from '@/utils/constants';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Space, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { MdOutlineLock } from 'react-icons/md';
import ModalCustom from '../ModalCustom';
import PopConfirmCustom from '../PopConfirmCustom';
import FormActiveCard from './FormActiveCard';
import { lockCard, permanentLock } from '@/service/cardService';
import { getDataApi } from '@/utils/api';
import { toastError, toastSuccess } from '@/utils/toast';
import { useLoading } from '@/hook/loading';

const TitleItemCard = ({ isAdmin, parentRef, status, cardId, onActionSuccess }) => {
  const [lock, setLock] = useState(status === CARD_STATUS_2.TAM_KHOA.value);
  const [openMore, setOpenMore] = useState(null);
  const [openPopConfirm, setOpenPopConfirm] = useState(false);
  const [openPopConfirmKVV, setOpenPopConfirmKVV] = useState(false);
  const [openPopActive, setOpenPopActive] = useState(false);
  const {showLoad, hideLoad} = useLoading();

  // handle
  const handleChangeOpen = (checked) => {
    setLock(checked);
    setOpenPopConfirm(true);
  };

  const handleChangeKVV = (checked) => {
    if (checked) {
      setOpenPopConfirmKVV(true);
    }
  };

  const handleActiveCard = (checked) => {
    if (checked) {
      setOpenPopActive(true);
    }
  };
  
  const handleActiveSuccess = (data) => {
    setOpenPopActive(false);
    if (onActionSuccess) {
      onActionSuccess(data);
    }
  };

  const handleOk = () => {
    showLoad(lineLoading);
    // call api
    lockCard(cardId, lock).then((response) => {
      const newData = getDataApi(response);
      setOpenPopConfirm(false);
      toastSuccess(`${lock ? "Khoá thẻ" : "Mở khoá"} thành công`);
      // cập nhật thông tin thẻ
      if(onActionSuccess) {
        onActionSuccess(newData)
      }
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(() => {
      hideLoad();
    })
  };

  const handleCancel = () => {
    setLock(pre => !pre);
    setOpenPopConfirm(false);
  };

  const handleOkKVV = () => {
    showLoad(lineLoading);
    // call api
    permanentLock(cardId).then((response) => {
      const newData = getDataApi(response);
      setOpenPopConfirmKVV(false);
      toastSuccess(`Thẻ đã bị khoá vĩnh viễn`);
      // cập nhật thông tin thẻ
      if(onActionSuccess) {
        onActionSuccess(newData)
      }
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(() => {
      hideLoad();
    })
  };

  const handleCancelKVV = () => {
    setOpenPopConfirmKVV(false);
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '0',
        label: (
          <div>
            Tạm khoá:{' '}
            <Switch
              checked={lock}
              onChange={handleChangeOpen}
              style={{ margin: 16 }}
            />
          </div>
        ),
        onClick: (e) => e.domEvent.preventDefault(),
      },
      {
        key: '1',
        label: (
          <div>
            Khoá vĩnh viễn:{' '}
            <Switch
              checked={false}
              onChange={handleChangeKVV}
              style={{ margin: 16 }}
            />
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div>
            Kích hoạt thẻ:{' '}
            <Switch
              checked={openPopActive}
              onChange={handleActiveCard}
              style={{ margin: 16 }}
            />
          </div>
        ),
      },
    ];

    if (status === CARD_STATUS_2.DANG_HOAT_DONG.value || status === CARD_STATUS_2.TAM_KHOA.value) {
      return items.filter(item => item.key === '0' || item.key === '1');
    } else if (status === CARD_STATUS_2.CHO_KICH_HOAT.value) {
      return items.filter(item => item.key === '2');
    }
    return [];
  };

  useEffect(() => {
    if (parentRef) {
      const element = parentRef.current;
      const handleScroll = () => {
        setOpenMore(false);
        setTimeout(() => {
          setOpenMore(null);
        }, 100);
      };

      element?.addEventListener('scroll', handleScroll);
      return () => element?.removeEventListener('scroll', handleScroll);
    }
  }, [parentRef]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>
        THẺ TỰ LIÊN KẾT{' '}
        {(status === CARD_STATUS_2.KHOA_VINH_VIEN.value || status === CARD_STATUS_2.TAM_KHOA.value) && (
          <MdOutlineLock />
        )}
      </span>
      {!isAdmin && (
        <>
          <Dropdown
            menu={{ items: getMenuItems() }}
            trigger={['click']}
            open={openMore}
            onOpenChange={(visible) => setOpenMore(visible)}
          >
            {getMenuItems().length > 0 && (
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenMore(true);
                }}
              >
                <Space>
                  <MoreOutlined style={{ fontSize: 25, color: 'white' }} />
                </Space>
              </a>
            )}
          </Dropdown>

          {openPopConfirm && (
            <PopConfirmCustom
              type="warning"
              title={
                !lock
                  ? 'Bạn có chắc chắn muốn tiếp tục sử dụng không?'
                  : 'Bạn có chắc chắn muốn tạm khoá không?'
              }
              message={
                !lock
                  ? 'Thẻ sẽ hoạt động bình thường sau khi nhấn đồng ý.'
                  : 'Bạn vẫn có thể mở lại trong vòng 1 giớ tới.'
              }
              handleCancel={handleCancel}
              handleOk={handleOk}
            />
          )}

          {openPopConfirmKVV && (
            <PopConfirmCustom
              type="warning"
              title="Bạn có chắc chắn muốn khoá thẻ vĩnh viễn không?"
              message="Bạn sẽ không thể mở lại sau khi nhấn đồng ý."
              handleCancel={handleCancelKVV}
              handleOk={handleOkKVV}
            />
          )}

          {openPopActive && (
            <ModalCustom onClose={() => setOpenPopActive(false)}>
              <FormActiveCard id={cardId} onSuccess={handleActiveSuccess} />
            </ModalCustom>
          )}
        </>
      )}
    </div>
  );
};

export default TitleItemCard;
