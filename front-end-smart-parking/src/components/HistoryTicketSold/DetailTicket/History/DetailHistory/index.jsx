import { Col, Row } from 'antd';
import './style.css'
import { IoCard } from 'react-icons/io5';
import { LiaQrcodeSolid } from "react-icons/lia";

const DetailHistory = () => {
  return (
    <div className='detail-history'>
      <h1 className='page-name pt0'>Thông tin lần gửi thứ nhất</h1>
      <div className="detail">
        <div className='detail-item'>
          <div className='label'>
            Địa điểm:
          </div>
          <div className='bold'>
            EAON MALL LONG BIÊN
          </div>
        </div>
        <div className='detail-item'>
          <div className='label'>
            Vị trí:
          </div>
          <div className='bold'>
            A12
          </div>
        </div>
        <Row>
          <Col lg={8} md={12} sm={12} xs={24}>
            <div className='detail-item'>
              <div className='label'>
                Giờ vào:
              </div>
              <div className='bold'>
                11:00 10/11/2025
              </div>
            </div>
            <div className='detail-item'>
              <div className='label'>
                Phương thức sử dụng:
              </div>
              <div className='bold'>
                <IoCard /> Quẹt thẻ
              </div>
            </div>
            <div className='detail-item'>
              <div className='label'>
                Số thẻ:
              </div>
              <div className='bold'>
                995209572190
              </div>
            </div>
          </Col>
          <Col lg={16} md={12} sm={12} xs={24}>
            <div className='detail-item'>
              <div className='label'>
                Giờ ra:
              </div>
              <div className='bold'>
                12:00 10/11/2025
              </div>
            </div>
            <div className='detail-item'>
              <div className='label'>
                Phương thức sử dụng:
              </div>
              <div className='bold'>
                <LiaQrcodeSolid /> Quét mã QR
              </div>
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
              <img src="https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2023/7/25/base64-1690292751248363319489.png" alt="checkin" />
            </div>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div>
              <h2 align="center">Ảnh ra</h2>
              <img src="https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2023/7/25/base64-1690292751248363319489.png" alt="checkout" />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DetailHistory;