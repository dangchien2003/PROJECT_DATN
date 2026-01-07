import ChildContent from '@/components/layout/Customer/ChildContent';
import LoadingComponent from '@/components/LoadingComponent';
import { useSelectMenu } from '@/hook/useSelectMenu';
import { extendRequest } from '@/service/ticketPurchasedService';
import { getDataApi } from '@/utils/api';
import { MENU_CUSTOMER_ID } from '@/utils/constants';
import { getCookie, setCookie } from '@/utils/cookie';
import { formatCurrency } from '@/utils/number';
import { toastError } from '@/utils/toast';
import logo from '@image/logo_parking.png';
import { Button, Col, Flex, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { IoTicket } from 'react-icons/io5';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StepOrder from '../OrderTicket/StepOrder';
import ItemBill from './ItemBill';
import './style.css';

const ConfirmExtend = () => {
  const navigate = useNavigate();
  const [extendInfo, setExtendInfo] = useState({});
  const [bill, setBill] = useState(null);
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_CUSTOMER_ID.DAT_VE);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  useEffect(() => {
    const extend = getCookie("extend");
    if (!extend) {
      navigate("/404")
    }
    // data ui
    var data = null;
    try {
      // data ui
      data = JSON.parse(extend);
    } catch (e) {
      navigate("/404")
    }
    setExtendInfo(data);
    const requestData = {
      ticketId: data?.ticketId,
      expires: data?.expires,
    }
    extendRequest(requestData).then(response => {
      const data = getDataApi(response);
      setBill(data);
      setCookie("confirm", JSON.stringify(data), 360)
    })
      .catch(e => {
        const response = getDataApi(e);
        toastError(response.message);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleNext = () => {
    navigate("/ticket/extend/payment/" + extendInfo.ticketId);
  }

  return (
    <div className='confirm-order'>
      <ChildContent backgroundColor='#f0f0f0'>
        <StepOrder current={1} />
      </ChildContent>
      <ChildContent backgroundColor='#f0f0f0' className='padding-footer'>
        <Row gutter={16}>
          <Col lg={16} md={24} className='item-col'>
            <div>
              <div className='title-box br3'>Thông tin tổng quan</div>
              <div className='content-box bw br3 pr0'>
                <div className='item-info'>
                  <span className='label-name'><IoTicket className='icon' />Bạn đang mua thêm thời gian: </span>
                  <span className='value-label'><b>{extendInfo.timeStr}</b></span>
                </div>
                <div className='item-info'>
                  <span className='label-name'><MdOutlineAccessTimeFilled className='icon' />Hạn mới: </span>
                  <span className='value-label'>Từ <b>{dayjs(extendInfo.startTime).format("DD/MM/YYYY HH:mm")}</b> đến <b>{dayjs(extendInfo.expires).format("DD/MM/YYYY HH:mm")}</b></span>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={8} md={24}>
            <div>
              <div className='title-box br3'>Đơn giá</div>
              <div className='content-box bw br3 bill'>
                <Flex justify='center'>
                  <img src={logo} alt="logo" className='logo' />
                </Flex>
                <h2 className='build-title'>Hoá đơn thanh toán</h2>
                <div className='pr content-bill'>
                  {bill !== null ? <div>
                    <ItemBill label={"Thời gian"} value={dayjs(bill.createdAt).format("DD/MM/YYYY HH:mm")} />
                    <ItemBill label={"Người thanh toán"} value={bill.personPaymentName} />
                    <ItemBill label={"Email"} value={bill.email} />
                    <ItemBill label={"Thời gian thêm"} value={extendInfo.timeStr} />
                    <ItemBill label={"Đơn giá"} value={<span>{formatCurrency(bill.priceUnit)}<sup>Đ/15 phút</sup></span>} />
                    <div className='total'>
                      <ItemBill label={"Thành tiền"} value={<span>{formatCurrency(bill.total)}<sup>Đ</sup></span>} />
                    </div>
                    <div className='action'>
                      <Button onClick={handleNext} color="primary" variant="solid">Thực hiện thanh toán</Button>
                    </div>
                  </div> : <LoadingComponent transparent />}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </ChildContent>
    </div>
  );
};

export default ConfirmExtend;