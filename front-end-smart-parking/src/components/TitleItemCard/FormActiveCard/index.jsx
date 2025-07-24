import InputError from '@/components/InputError';
import { useLoading } from '@/hook/loading';
import { useMessageError } from '@/hook/validate';
import { activeCard } from '@/service/cardService';
import { getDataApi } from '@/utils/api';
import { Flex, Input } from 'antd';
import { useEffect, useState } from 'react';
import './style.css';
import { toastSuccess } from '@/utils/toast';

const keyOtpError = "keyActive"
const FormActiveCard = ({ id, onSuccess }) => {
  const [otp, setOtp] = useState(null);
  const { hideLoad, showLoad } = useLoading();
  const { pushMessage, deleteKey } = useMessageError();

  useEffect(() => {
    if (otp === null || otp.length !== 6) {
      return;
    }
    showLoad({ type: 2 });
    // call api
    activeCard(id, otp).then((response) => {
      const data = getDataApi(response);
      if(onSuccess) {
        onSuccess(data);
      }
      toastSuccess("Kích hoạt thành công")
    }).catch((e) => {
      const error = getDataApi(e);
      pushMessage(keyOtpError, error.message);
    }).finally(() => {
      hideLoad();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [otp])

  const handleInput = (value) => {
    setOtp(value.join(''));
    deleteKey(keyOtpError);
  }
  return (
    <div>
      <h1 className='mb12'>Nhập mã kích hoạt</h1>
        <div>
          <Flex justify="center" className="otp">
            <Input.OTP length={6} formatter={(str) => str.replace(/\D/g, '')} onInput={handleInput} />
          </Flex>
          <div style={{textAlign: "center"}}>
            <InputError itemKey={keyOtpError} />
          </div>
        </div>
    </div>
  )
};

export default FormActiveCard;