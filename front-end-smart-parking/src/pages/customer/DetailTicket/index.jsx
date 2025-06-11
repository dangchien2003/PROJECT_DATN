import ChildContent from '@/components/layout/Customer/ChildContent';
import ModalCustom from '@/components/ModalCustom';
import QrTicket from '@/components/QrTicket';
import { Col, Flex, Row, Tooltip } from 'antd';
import { useState } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa6';
import { GoDotFill } from "react-icons/go";
import { IoTicket } from 'react-icons/io5';
import History from './History';
import './style.css';

const DetailTicket = () => {
  const [dataTicketShowQr, setDataTicketShowQr] = useState(null);

  const handleShowQr = () => {
    setDataTicketShowQr({name: "VÉ VIP HÀ NỘI"})
  }

  const handleCloseQr = () => {
    setDataTicketShowQr(null);
  }
  return (
    <div>
      <ChildContent className='detail-ticket'>
        <div>
          <Row gutter={48}>
            <Col lg={13} md={12} sm={24} xs={24} className='info br3'>
              <div>
                <h2 className='page-name pt0'>Thông tin</h2>
                <div className='padding-content'>
                  <div className='detail-item'>
                    <Flex>
                      <IoTicket className='icon' />
                      <div>
                        <div className='ticket-name'>Vé vip eaon mall
                        </div>
                        <div className='status'>
                          <GoDotFill style={{ color: 'red' }} /> Tạm đình chỉ
                        </div>
                        <div className='error'>Chúng tôi nhận thấy điều bất thường hoạt động vé này. Vui lòng đợi xác minh</div>
                      </div>
                    </Flex>
                  </div>
                  <div className='detail-item'>
                    <div className='label'>
                      Địa điểm:
                    </div>
                    <div>
                      <div>EAON MALL LONG BIÊN</div>
                      <div>Nhân Kiệt, Hùng Thắng, Bình Giang, Hải Dương</div>
                    </div>
                  </div>
                  <div className='detail-item'>
                    <div className='label'>
                      Hạn sử dụng:
                    </div>
                    <div>
                      <b>
                        <span>11:00 10/11/2025</span> <span> - </span>
                        <span>11:00 11/11/2025</span>
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
                          8 lượt
                        </div>
                      </div>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                      <div className='detail-item'>
                        <div className='label'>
                          Biển số:
                        </div>
                        {/* <div>
                          34AN-01864
                        </div> */}
                        <div className='button-link'>
                          <BiSolidEdit /> Thêm biển số
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className='detail-item end'>
                    <div className='label'>
                      Sử dụng thêm:
                    </div>
                    <div>
                      10 phút - 10.000<sup>Đ</sup>
                    </div>
                  </div>
                  <div className='detail-item end'>
                    <div className='label'>
                      QR đã tạo:
                    </div>
                    <div>
                      8 lượt
                    </div>
                    <Tooltip title="Xem">
                      <div className='button-link' onClick={handleShowQr}>
                        <FaEye />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={11} md={12} sm={24} xs={24} className='history'>
              <h2 className='page-name'>Lịch sử</h2>
              <div className='padding-content'>
                <History />
              </div>
            </Col>
          </Row>
        </div>
      </ChildContent >
      {dataTicketShowQr && <ModalCustom onClose={handleCloseQr}>
        <QrTicket data={dataTicketShowQr} />
      </ModalCustom>}
    </div >
  );
};

export default DetailTicket;