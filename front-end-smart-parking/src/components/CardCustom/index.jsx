import { useLoading } from '@/hook/loading';
import { unlinkTicket } from '@/service/cardService';
import { getDataApi } from '@/utils/api';
import { CARD_STATUS, CARD_STATUS_2, CARD_TYPE, lineLoading } from '@/utils/constants';
import { toastError, toastSuccess } from '@/utils/toast';
import { Card, Tooltip } from 'antd';
import dayjs from "dayjs";
import { useEffect, useState } from 'react';
import { FaLink } from 'react-icons/fa6';
import { LuUnlink } from "react-icons/lu";
import { Link } from 'react-router-dom';
import DotStatus from '../DotStatus';
import ModalCustom from '../ModalCustom';
import TitleItemCard from '../TitleItemCard';
import LinkTicket from './LinkTicket';
import './style.css';

const CardCustom = ({ isAdmin, parentRef, data = {} }) => {
  const { showLoad, hideLoad } = useLoading();
  const [dataCard, setDataCard] = useState(data);
  const [openLink, setOpenLink] = useState(false);

  useEffect(() => {
    setDataCard(data);
  }, [data])

  const onActionSuccess = (newData) => {
    setDataCard(newData);
    handleCloseLinkTicket(false);
  }

  const handleLinkTicket = () => {
    setOpenLink(true);
  }

  const handleCloseLinkTicket = () => {
    setOpenLink(false);
  }

  const handleCancelLinkTicket = () => {
    showLoad(lineLoading);
    unlinkTicket(dataCard.id).then(response => {
      const result = getDataApi(response);
      setDataCard(result);
      toastSuccess("Huỷ liên kết thành công");
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(hideLoad);
  }
  return (
    <div style={{ display: 'flex' }} className='card'>
      <Card
        title={<TitleItemCard isAdmin={isAdmin} parentRef={parentRef} status={Number(dataCard.status)} cardId={dataCard.id} onActionSuccess={onActionSuccess} />}
        bordered={false}
        bodyStyle={{ paddingTop: 24 }}
        className='card-item'
      >
        <div className="body">
          <div className='info'>
            <span>Số thẻ: </span>
            <span className='card-number'>{dataCard.numberCard}</span>
          </div>
          {isAdmin && <>
            <div className='info'>Chủ sở hữu: <Link to={"/admin/account/customer/" + dataCard.accountId} style={{ color: "white", textDecoration: "underline" }}>{dataCard.owner}</Link></div>
            <div className='info'>Loại thẻ: {CARD_TYPE[dataCard.type]?.label}</div>
          </>}
          <div className='info'>Lần cấp: {dataCard.issuedTimes}</div>
          <div className='info'>Ngày cấp: {dataCard.issuedDate && dayjs(dataCard.issuedDate).format("DD/MM/YYYY")}</div>
          <div className='info'>Thời hạn: {!dataCard.expireDate ? "Vô hạn" : dayjs(dataCard.expireDate).format("DD/MM/YYYY")}</div>
          <div className='info'>Số lần sử dụng: {dataCard.usedTimes}</div>
          <div className='info'>
            <span>Trạng thái: </span>
            <span className={CARD_STATUS[dataCard.status]?.color}><DotStatus /></span>
            <span>{CARD_STATUS[dataCard.status]?.label}</span>
          </div>
          {(dataCard.status === CARD_STATUS_2.DANG_HOAT_DONG.value || dataCard.status === CARD_STATUS_2.TAM_KHOA.value) && <div className='info'>
            Đang liên kết: {dataCard.ticketLink && <Link to={isAdmin ? "/ticket/detail/" + dataCard.ticketLink : "/ticket/detail/" + dataCard.ticketLink} style={{ color: "white", textDecoration: "underline" }}>{dataCard.ticketLink}</Link>}
            {
              !isAdmin && <span style={{ padding: '0px 4px' }}>
              {dataCard.status === CARD_STATUS_2.DANG_HOAT_DONG.value && <Tooltip title={"Thay đổi liên kết"}>
                <span onClick={handleLinkTicket} style={{paddingRight: 4}}>
                  <FaLink />
                </span>
              </Tooltip>}
              {dataCard.ticketLink && <Tooltip title={"Huỷ liên kết"}>
                <span onClick={handleCancelLinkTicket} >
                  <LuUnlink />
                </span>
              </Tooltip>}
            </span>
            }
          </div>}
          {isAdmin && <>
            <div>Người yêu cầu: <Link to={"/admin/account/customer/" + dataCard.requestCreateBy} style={{ color: "white", textDecoration: "underline" }}>{dataCard.requestCreateName}</Link></div>
            <div>Ngày yêu cầu: {dataCard.requestDate && dayjs(dataCard.requestDate).format("DD/MM/YYYY")}</div>
          </>}
        </div>
      </Card >
      {openLink && <ModalCustom onClose={handleCloseLinkTicket}>
        <LinkTicket cardId={dataCard.id} onLinkSuccess={onActionSuccess} />
      </ModalCustom>}
    </div >
  )
}

export default CardCustom
