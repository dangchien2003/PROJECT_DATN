import ModalCustom from '@/components/ModalCustom';
import useResponsiveKey from '@/hook/useReponsive';
import { Col, Flex, Row } from 'antd';
import dayjs from "dayjs";
import { useState } from 'react';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import Edit from './Edit';
import EditEmail from './EditEmail';
import EditGender from './EditGender';
import EditName from './EditName';
import EditPhoneNumber from './EditPhoneNumber';
import './style.css';
import { ACCOUNT_CATEGORY } from '@/utils/constants';

const Info = ({info}) => {
  const [editKey, setEditKey] = useState(null);
  const { key } = useResponsiveKey();

  const handleClickEdit = (value) => {
    setEditKey(value);
  }

  const handleCloseEdit = () => {
    setEditKey(null);
  }
  return (
    <div className="info">
      <Row>
        <Col lg={12} md={12} sm={24} xs={24} style={["sm", "xs"].includes(key) ? { paddingBottom: 12 } : {}}>
          <div className="personal">
            <h3 className='page-name'>Thông tin cá nhân</h3>
            <Flex gap={8}>
              <div className='detail-item end'>
                <div className='label'>
                  Tên người dùng:
                </div>
                <div className='value'>
                  {info.fullName}
                </div>
              </div>
              <Edit value={1} onClick={handleClickEdit} />
            </Flex>
            <Flex gap={8}>
              <div className='detail-item end'>
                <div className='label'>
                  Số điện thoại:
                </div>
                <div className='value'>
                  {info.phoneNumber}
                </div>
              </div>
              <Edit value={2} onClick={handleClickEdit} />
            </Flex>
            <Flex gap={8}>
              <div className='detail-item end'>
                <div className='label'>
                  Email:
                </div>
                <div className='value'>
                  {info.email}

                  {/* -- không có thông tin*/}
                </div>
              </div>
              <Edit value={3} onClick={handleClickEdit} />
            </Flex>
            <Flex gap={8}>
              <div className='detail-item end'>
                <div className='label'>
                  Giới tính:
                </div>
                <div className='value'>
                  {(info.gender === 0 && <>
                    <IoMdMale className='gender-male' />Nam
                  </>)}
                  {(info.gender === 1 && <>
                    <IoMdFemale className='gender-female' />Nữ
                  </>)}
                </div>
              </div>
              <Edit value={4} onClick={handleClickEdit} />
            </Flex>
            <div className='detail-item end'>
              <div className='label'>
                Ngày tạo:
              </div>
              <div className='value'>
                {dayjs(info.createdAt).format("DD/MM/YYYY")}
              </div>
            </div>
          </div>
        </Col>
        {info.category === ACCOUNT_CATEGORY.PARTNER && <Col lg={12} md={12} sm={24} xs={24} style={["sm", "xs"].includes(key) ? { paddingTop: 12, borderTop: "1px solid #f0f0f0" } : {}}>
          <div className="partner">
            <h3 className='page-name'>Thông tin đối tác</h3>
            <div className='detail-item end'>
              <div className='label'>
                Tên tổ chức:
              </div>
              <div className='value'>
                {info.partnerFullName}
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Người đại diện:
              </div>
              <div className='value'>
                {info.representativeFullName}
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Số điện thoại:
              </div>
              <div className='value'>
                {info.partnerPhoneNumber}
              </div>
            </div>
            <div className='detail-item end'>
              <div className='label'>
                Email:
              </div>
              <div className='value'>
                {info.partnerEmail}
              </div>
            </div>
            <div className='detail-item'>
              <div className='label'>
                Địa chỉ:
              </div>
              <div className='value'>
                {info.partnerAddress}
              </div>
            </div>
            <div className="note">
              Để thay đổi thông tin đối tác vui lòng liên hệ trung tâm hỗ trợ.
            </div>
          </div>
        </Col>}
      </Row>
      {editKey !== null && <ModalCustom onClose={handleCloseEdit}>
        {editKey === 1 && <EditName oldData={info.fullName} itemKey={"name"} />}
        {editKey === 2 && <EditPhoneNumber oldData={info.phoneNumber} itemKey={"phoneNumber"} />}
        {editKey === 3 && <EditEmail oldData={info.email} itemKey={"email"} />}
        {editKey === 4 && <EditGender oldData={info.gender} itemKey={"gender"} />}
      </ModalCustom>}
    </div>
  );
};

export default Info;