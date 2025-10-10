import { Col, Flex, Row } from 'antd';
import './style.css'
import { IoCard } from 'react-icons/io5';
import { LiaQrcodeSolid } from "react-icons/lia";
import { detailChecking } from '@/service/checkingService';
import { useEffect, useState } from 'react';
import { getDataApi } from '@/utils/api';
import { toastError } from '@/utils/toast';
import dayjs from 'dayjs'

const DetailHistory = ({ id }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    detailChecking(id).then(response => {
      const result = getDataApi(response);
      setData(result);
    })
      .catch(e => {
        const response = getDataApi(e);
        toastError(response.message);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div className='detail-history' style={{ width: "800px" }}>
      <h1 className='page-name pt0'>Thông tin</h1>
      <div className="detail">
        <div className='detail-item'>
          <div className='label'>
            Địa điểm:
          </div>
          <div className='bold'>
            {data.locationName}
          </div>
        </div>
        <div className='detail-item'>
          <div className='label'>
            Vị trí:
          </div>
          <div className='bold'>
            {data.position}
          </div>
        </div>
        <Row gutter={20}>
          <Col lg={12} md={12} sm={12} xs={24}>
            <div>
              <div style={{ display: "inline-block" }}>
                <div className='detail-item'>
                  <div className='label'>
                    Giờ vào:
                  </div>
                  <div className='bold'>
                    {dayjs(data.checkinAt).format("HH:mm DD/MM/YYYY")}
                  </div>
                </div>
                <div className='detail-item'>
                  <Flex>
                    <div className='label'>
                      Phương thức sử dụng:
                    </div>
                    <div className='bold'>
                      {(data.checkinMethod !== null && data.checkinMethod !== undefined) ? (data.checkinMethod === 0 ? <><LiaQrcodeSolid /> Quét mã QR</> : <><IoCard /> Quẹt thẻ</>) : ""}
                    </div></Flex>
                </div>
                <div className='detail-item'>
                  <div className='label'>
                    Số thẻ:
                  </div>
                  <div className='bold'>
                    {data.numberCard}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={12} md={12} sm={12} xs={24}>
            <div className='detail-item'>
              <div className='label'>
                Giờ ra:
              </div>
              <div className='bold'>
                {data.checkoutAt ? dayjs(data.checkoutAt).format("HH:mm DD/MM/YYYY") : null}
              </div>
            </div>
            <div className='detail-item'>
              <Flex>
                    <div className='label'>
                      Phương thức sử dụng:
                    </div>
                    <div className='bold'>
                      {(data.checkoutMethod !== null && data.checkoutMethod !== undefined) ? (data.checkoutMethod === 0 ? <><LiaQrcodeSolid /> Quét mã QR</> : <><IoCard /> Quẹt thẻ</>) : ""}
                    </div></Flex>
            </div>
            {/* <div className='detail-item'>
              <div className='label'>
                Số thẻ:
              </div>
              <div className='bold'>
                995209572190
              </div>
            </div> */}
          </Col>
        </Row>
      </div>
      <div className='image hide-scrollbar'>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div>
              <h2 align="center">Ảnh vào</h2>
              <img src={data.imagePlateIn} alt="checkin" />
            </div>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div>
              <h2 align="center">Ảnh ra</h2>
              {data.checkoutAt ? <img src={data.imagePlateOut} alt="checkout" /> : null}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DetailHistory;