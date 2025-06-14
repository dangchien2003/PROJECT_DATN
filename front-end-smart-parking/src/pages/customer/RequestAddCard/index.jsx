import BoxTextArea from '@/components/BoxTextArea';
import TextFieldLabelDash from '@/components/TextFieldLabelDash';
import { Button, Col, Flex, Row } from 'antd';
import './style.css';
import InputLabel from '@/components/InputLabel';
import TextArea from 'antd/es/input/TextArea';
import { IoIosSend } from 'react-icons/io';

const RequestAddCard = () => {
  return (
    <div className='request-add-card'>
      <h2 className='name-page'>Yêu cầu cấp thẻ</h2>
      <Row>
        <Col>
          <TextFieldLabelDash label={"Lần yêu cầu"} defaultValue={1} disable={true} color={"black"} />
        </Col>
        <Col>
          <TextFieldLabelDash label={"Ngày yêu cầu"} defaultValue={"14/06/2025"} disable={true} color={"black"} />
        </Col>
        <Col xxl={24} lg={24} md={24} sm={24} xs={24}>
          <div>
            <div
              style={{
                position: "relative",
                width: 250,
                padding: "16px 8px",
                paddingBottom: 0,
                borderTop: "1px solid #B9B7B7",
                margin: 16,
                marginBottom: 0
              }}
            >
              <InputLabel label={"Lý do xin cấp"} />
            </div>
            <div className='reason-box'>
              <TextArea className='reason' rows={10} placeholder='Nhập lý do' maxLength={500}/>
            </div>
          </div>
        </Col>
      </Row>
      <Flex justify='center' className='action'>
          <Button variant='solid' color='primary'><IoIosSend className='icon'/> Gửi yêu cầu</Button>
      </Flex>
    </div>
  );
};

export default RequestAddCard;