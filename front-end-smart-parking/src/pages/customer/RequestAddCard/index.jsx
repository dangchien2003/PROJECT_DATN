import InputLabel from '@/components/InputLabel';
import TextFieldLabelDash from '@/components/TextFieldLabelDash';
import { Button, Col, Flex, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import './style.css';
import { requestAddCard } from '@/service/cardService';
import { getDataApi } from '@/utils/api';
import { toastError, toastSuccess } from '@/utils/toast';
import { useLoading } from '@/hook/loading';
import { lineLoading } from '@/utils/constants';

const RequestAddCard = ({ maxRequestTimes = 0, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const {showLoad, hideLoad} = useLoading();

  const handleChangeReason = (e) => {
    const value = e.target.value;
    setReason(value);
    validateReason(value);
  }

  const handleBlurReason = () => {
    const newReason = reason.trim();
    setReason(newReason);
    validateReason(newReason);
  }

  const handleSendRequest = () => {
    if(!validateReason(reason)) return;
    showLoad(lineLoading);
    requestAddCard(reason).then(() => {
      toastSuccess("Yêu cầu của bạn đã được gửi thành công");
      if(onSuccess) onSuccess();
    })
    .catch((e) => {
      const error = getDataApi(e);
      toastError(error.message);
    })
    .finally(() => {
      hideLoad();
    })
  }

  const validateReason = (value) => {
    var noError = false;
    if (value.length === 0) {
      setError("Không được để trống lý do xin cấp")
    } else {
      setError(null);
      noError = true;
    }
    return noError;
  }


  return (
    <div className='request-add-card'>
      <h2 className='name-page'>Yêu cầu cấp thẻ</h2>
      <Row>
        <Col>
          <TextFieldLabelDash label={"Lần yêu cầu"} defaultValue={maxRequestTimes + 1} disable={true} color={"black"} />
        </Col>
        <Col>
          <TextFieldLabelDash label={"Ngày yêu cầu"} defaultValue={dayjs().format("DD/MM/YYYY")} disable={true} color={"black"} />
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
              <InputLabel label={"Lý do xin cấp"} require={true} />
            </div>
            <div className='reason-box'>
              <TextArea
                className='reason'
                value={reason}
                onChange={handleChangeReason}
                onBlur={handleBlurReason}
                placeholder='Nhập lý do'
                rows={10}
                maxLength={500} />
                {error !== null &&
                  <div className={"error-field"} style={{ fontSize: 12, padding: 4, color: "red" }}>{error}</div>
                }
            </div>
          </div>
        </Col>
      </Row>
      <Flex justify='center' className='action'>
        <Button onClick={handleSendRequest} variant='solid' color='primary'><IoIosSend className='icon' /> Gửi yêu cầu</Button>
      </Flex>
    </div>
  );
};

export default RequestAddCard;