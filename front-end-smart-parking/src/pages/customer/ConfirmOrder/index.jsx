import ChildContent from '@/components/layout/Customer/ChildContent';
import { getCookie, setCookie } from '@/utils/cookie';
import logo from '@image/logo_parking.png';
import { Button, Col, Flex, Row } from 'antd';
import { useEffect, useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { IoTicket, IoWarning } from 'react-icons/io5';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StepOrder from '../OrderTicket/StepOrder';
import ItemBill from './ItemBill';
import './style.css';
import { createOrder } from '@/service/orderService';
import { getDataApi } from '@/utils/api';
import dayjs from 'dayjs';
import { toastError } from '@/utils/toast';
import LoadingComponent from '@/components/LoadingComponent';
import { formatCurrency } from '@/utils/number';

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState({});
  const [bill, setBill] = useState(null);
  useEffect(() => {
    const order = getCookie("order");
    if (!order) {
      navigate("/404")
    }
      // data ui
      var data = null;
    try {
      // data ui
      data = JSON.parse(order);
    } catch (e) {
      navigate("/404")
    }
    setOrderInfo(data);
    // data order
    var ownersId = null;
    if (data?.owner && Array.isArray(data.owner) && data.owner.length > 0) {
      ownersId = data?.owner.map(item => item.id)
    }
    const requestData = {
      locationId: data?.locationId,
      ticketId: data?.ticketId,
      ticketCategory: data?.category,
      quality: data?.quality,
      startTime: dayjs(data.startTime).format("YYYY-MM-DDTHH:mm:00"),
      helpBuy: ownersId
    }
    createOrder(requestData).then(response => {
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
    navigate("/payment/" + bill.orderId);
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
                  <span className='label-name'><IoTicket className='icon' />Bạn đang mua vé: </span>
                  <span className='value-label'><b>{orderInfo.ticketName}</b></span>
                </div>
                <div className='item-info'>
                  <div className='child'>
                    <span className='label-name'><FaLocationDot className="icon" />Sử dụng cho địa điểm: </span>
                    <span className='value-label'><b>{orderInfo.locationName}</b></span>
                  </div>
                  <div>
                    <span className='label-name'><span className='icon empty'></span>Địa chỉ: </span>
                    <span className='value-label'><b>{orderInfo.address}</b></span>
                  </div>
                </div>
                <div className='item-info'>
                  <span className='label-name'><MdOutlineAccessTimeFilled className='icon' />Hạn sử dụng: </span>
                  <span className='value-label'>Từ <b>{dayjs(orderInfo.startTime).format("DD/MM/YYYY HH:mm")}</b> đến <b>{dayjs(orderInfo.endTime).format("DD/MM/YYYY HH:mm")}</b></span>
                </div>
                <div className='item-info break owner'>
                  <span className='label-name'><FaUserAlt className="icon" />Chủ sở hữu: </span>
                  {
                    orderInfo.owner?.length > 0 ?
                      <>
                        <p className='warning child'><IoWarning className='icon warning' /> Người dùng dưới đây sẽ được toàn quyền sử dụng mọi chức năng với vé được mua hộ</p>
                        <span className='value-label'>
                          <ol>
                            {orderInfo.owner.map((item, index) => <li key={index}>{item.email} - <b>{item.fullName}</b></li>)}
                          </ol>
                        </span>
                      </>
                      : <span><b>Tài khoản hiện tại</b></span>
                  }
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
                    <ItemBill label={"Hạn từ"} value={dayjs(bill.startTime).format("DD/MM/YYYY HH:mm")} />
                    <ItemBill label={"Đến"} value={dayjs(bill.expire).format("DD/MM/YYYY HH:mm")} />
                    <ItemBill label={"Số lượng"} value={bill.qualityTicket} />
                    <ItemBill label={"Đơn giá"} value={<span>{formatCurrency(bill.priceUnit)}<sup>Đ</sup></span>} />
                    <div className='total'>
                      <ItemBill label={"Thành tiền"} value={<span>{formatCurrency(bill.total)}<sup>Đ</sup></span>} />
                    </div>
                    <div className='action'>
                      <Button onClick={handleNext} color="primary" variant="solid">Thực hiện thanh toán</Button>
                    </div>
                  </div> : <LoadingComponent transparent/>}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </ChildContent>
    </div>
  );
};

export default ConfirmOrder;