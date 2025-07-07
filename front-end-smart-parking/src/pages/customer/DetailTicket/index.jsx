import ChildContent from '@/components/layout/Customer/ChildContent';
import LoadingComponent from '@/components/LoadingComponent';
import ModalCustom from '@/components/ModalCustom';
import QrTicket from '@/components/QrTicket';
import { getDetail } from '@/service/ticketPurchasedService';
import { getDataApi } from '@/utils/api';
import { TICKET_PURCHASED_STATUS } from '@/utils/constants';
import { formatCurrency } from '@/utils/number';
import { convertDataSelectboxToObject, convertObjectToDataSelectBox } from '@/utils/object';
import { toastError } from '@/utils/toast';
import { Col, Flex, Row, Slider, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa6';
import { GoDotFill } from "react-icons/go";
import { IoTicket } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import History from './History';
import MoreView from './MoreView';
import './style.css';

const ticketPurchasedStatus = convertDataSelectboxToObject(convertObjectToDataSelectBox(TICKET_PURCHASED_STATUS));
const DetailTicket = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [usedRatio, setUsedRatio] = useState(0);
  const [dataTicketShowQr, setDataTicketShowQr] = useState(null);

  const handleShowQr = () => {
    setDataTicketShowQr({
      ticketName: detail?.ticketName,
      id: detail?.id
    })
  }

  const handleCloseQr = () => {
    setDataTicketShowQr(null);
  }

  useEffect(() => {
    setLoading(true);
    getDetail(id).then((response) => {
      const data = getDataApi(response);
      setDetail(data);
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

  // cập nhật thời lượng sử dụng sau mỗi 1 phút
  useEffect(() => {
    var idInterval = null;
    if (detail) {
      getUsedTimePercentage();
      idInterval = setInterval(getUsedTimePercentage, 60000)
    }
    return () => { clearInterval(idInterval) }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [detail])

  function getUsedTimePercentage() {
    const now = dayjs()
    const start = dayjs(detail.startsValidity)
    const end = dayjs(detail.expires)

    // Nếu now trước start hoặc sau end
    if (now.isBefore(start)) {
      setUsedRatio(0);
    }
    if (now.isAfter(end)) {
      setUsedRatio(100);
    }

    const totalDuration = end.diff(start) // milliseconds
    const usedDuration = now.diff(start)

    const percentage = (usedDuration / totalDuration) * 100
    setUsedRatio(Math.min(Math.max(percentage, 0), 100))
  }

  const handleChangeDisableSuccess = (status) => {
    setDetail(pre => ({...pre, status}))
  }

  const handleRefreshQrSuccess = () => {
    setDetail(pre => ({...pre, createdQrCodeCount: pre.createdQrCodeCount + 1}));
  }
  return (
    <div>
      <ChildContent className='detail-ticket mb16'>
        <div>
          <Row gutter={48}>
            <Col lg={12} md={12} sm={24} xs={24} className='info'>
              <div>
                <h2 className='page-name pt0'>Thông tin</h2>
                <div className='padding-content pr'>
                  {loading && <LoadingComponent transparent />}
                  {(!loading && detail !== null) && <>
                    <div className='detail-item'>
                      <Flex justify='space-between' style={{ width: "100%" }}>
                        <Flex>
                          <IoTicket className='icon' />
                          <div>
                            <div className='ticket-name'>{detail?.ticketName}
                            </div>
                            <div className='status'>
                              <GoDotFill 
                              className={ticketPurchasedStatus[detail.status].color} /> {ticketPurchasedStatus[detail.status].label}
                            </div>
                            <div className='error'>{detail?.reason}</div>
                          </div>
                        </Flex>
                        <div>
                          {(detail?.status === TICKET_PURCHASED_STATUS.BINH_THUONG.value || detail?.status === TICKET_PURCHASED_STATUS.TAM_DINH_CHI.value) && <MoreView ticketId={detail.id} disableInp={detail?.status === TICKET_PURCHASED_STATUS.TAM_DINH_CHI.value} onChangeSuccess={handleChangeDisableSuccess}/>}
                        </div>
                      </Flex>
                    </div>
                    <div className='detail-item'>
                      <div className='label'>
                        Địa điểm:
                      </div>
                      <div>
                        <div className='bold'>{detail?.locationName}</div>
                        <div>{detail?.locationAddress}</div>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <div className='label'>
                        Hạn sử dụng:
                      </div>
                      <div>
                        <b>
                          <span>{dayjs(detail?.startsValidity).format("HH:mm DD/MM/YYYY")}</span> <span> - </span>
                          <span>{dayjs(detail?.expires).format("HH:mm DD/MM/YYYY")}</span>
                        </b>
                      </div>
                    </div>
                    <Row>
                      <Col lg={12} md={12} sm={12} xs={24}>
                        <div className='detail-item'>
                          <div className='label'>
                            Đã dùng:
                          </div>
                          <div>
                            {detail?.usedTimes} lượt
                          </div>
                        </div>
                      </Col>
                      <Col lg={12} md={12} sm={12} xs={24}>
                        <div className='detail-item'>
                          <div className='label'>
                            Biển số:
                          </div>
                          <div>
                            {detail?.contentPlate}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className='detail-item end'>
                      <div className='label'>
                        Sử dụng thêm:
                      </div>
                      <div>
                        {detail?.priceExtend && <span>{detail?.timeExtend} phút - {formatCurrency(detail?.priceExtend)}<sup>Đ</sup></span>}
                      </div>
                    </div>
                    <div className='detail-item end'>
                      <div className='label'>
                        QR đã tạo:
                      </div>
                      <div>
                        {detail?.createdQrCodeCount} lượt
                      </div>
                      {/* không hiện icon xem nếu vé không còn hiệu lực */}
                      {(detail?.status === TICKET_PURCHASED_STATUS.BINH_THUONG.value && dayjs(detail?.expires).isAfter(dayjs())) && <Tooltip title="Xem">
                        <div className='button-link' onClick={handleShowQr}>
                          <FaEye />
                        </div>
                      </Tooltip>}
                    </div>
                    <Slider max={100} value={usedRatio} tooltip={{
                      placement: 'top',
                      formatter: (value) => `${value}%`,
                      overlayInnerStyle: {
                        backgroundColor: '#333',
                        color: 'white',
                        fontWeight: 'bold',
                      },
                    }} />
                  </>}
                </div>

              </div>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24} className='history'>
              <h2 className='page-name'>Lịch sử</h2>
              <div className='padding-content'>
                <History />
              </div>
            </Col>
          </Row>
        </div >
      </ChildContent >
      {dataTicketShowQr && <ModalCustom onClose={handleCloseQr}>
        <QrTicket data={dataTicketShowQr} onRefresh={handleRefreshQrSuccess}/>
      </ModalCustom>}
    </div >
  );
};

export default DetailTicket;