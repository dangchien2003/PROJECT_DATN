import { Button, Col, Row } from 'antd';
import { FaEdit } from 'react-icons/fa';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import './style.css';
import useResponsiveKey from '@/hook/useReponsive';

const Info = () => {
  const { key } = useResponsiveKey();
  return (
    <div className="info">
      <Row>
        <Col lg={12} md={12} sm={24} xs={24} style={["sm", "xs"].includes(key) ? { paddingBottom: 12 } : {}}>
          <div className="personal">
            <h3 className='page-name'>Thông tin cá nhân</h3>
            <div className='detail-item end'>
              <div className='label'>
                Tên người dùng:
              </div>
              <div className='value'>
                Lê Đăng Chiến
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Số điện thoại:
              </div>
              <div className='value'>
                0333757429
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Email:
              </div>
              <div className='value'>
                Chienboy03@gmail.com
                {/* -- không có thông tin*/}
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Giới tính:
              </div>
              <div className='value'>
                 <IoMdFemale className='gender-female' />Nữ 
                 {/*<IoMdMale className='gender-male' />Nam */}
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Ngày tạo:
              </div>
              <div className='value'>
                18/06/2025
              </div>
            </div>
            <div className="action">
              <Button variant='solid' type='primary'>
                <FaEdit /> Thay đổi thông tin
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24} style={["sm", "xs"].includes(key) ? { paddingTop: 12, borderTop: "1px solid #f0f0f0" } : {}}>
          <div className="partner">
            <h3 className='page-name'>Thông tin đối tác</h3>
            <div className='detail-item end'>
              <div className='label'>
                Tên tổ chức:
              </div>
              <div className='value'>
                EAON MALL LONG BIÊN
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Người đại diện:
              </div>
              <div className='value'>
                Lê Đăng Chiến
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Số điện thoại:
              </div>
              <div className='value'>
                0333757429
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Email:
              </div>
              <div className='value'>
                Chienboy03@gmail.com
              </div>
            </div>
            <div className='detail-item'>
              <div className='label'>
                Địa chỉ:
              </div>
              <div className='value'>
                Nhân Kiệt, Hùng Thắng, Bình Giang, Hải Dương
              </div>
            </div>
            <div className="note">
              Nếu muốn thay đổi thông tin đối tác vui lòng liên hệ trung tâm hỗ trợ.
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Info;