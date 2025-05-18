import InputError from '@/components/InputError';
import { useLoading } from '@/hook/loading';
import { useMessageError } from '@/hook/validate';
import { confirmForget } from '@/service/authenticationService';
import { getDataApi } from '@/utils/api';
import { Flex, Input } from 'antd'
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import successImage from "@image/check.png";

const keyForgetError = "forgetError"
const OtpBox = ({ size, id, timeOutId, onConfirmSuccess }) => {
  const [otp, setOtp] = useState(null);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const { hideLoad, showLoad } = useLoading();
  const { pushMessage, deleteKey } = useMessageError();

  useEffect(() => {
    if (otp === null || !size || otp.length !== size || sending) {
      return;
    }
    showLoad({ type: 2 });
    setSending(true);
    const payload = {
      id,
      otp
    }
    confirmForget(payload).then((response) => {
      const result = getDataApi(response);
      setEmail(result);
      setConfirmSuccess(true);
      if(onConfirmSuccess) {
        onConfirmSuccess()
      }
      // xoá time out
      if(timeOutId) {
        clearTimeout(timeOutId);
      }
    }).catch((e) => {
      const error = getDataApi(e);
      pushMessage(keyForgetError, error.message);
    }).finally(() => {
      hideLoad();
      setSending(false);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [otp])

  const handleInput = (value) => {
    setOtp(value.join(''));
    deleteKey(keyForgetError);
  }
  return (
    <div>
      {!confirmSuccess ?
        <div>
          <Flex justify="center" className="otp">
            <Input.OTP length={size} formatter={(str) => str.replace(/\D/g, '')} onInput={handleInput} />
            
          </Flex>
          <div style={{textAlign: "center"}}>
            <InputError isAuthen={true} itemKey={keyForgetError} />
          </div>
        </div>
        : <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="success-container"
        >
          <p className="success-notify">
            Mật khẩu sẽ được gửi tới bạn trong giây lát.
            <br />
            Vui lòng kiểm tra hòm thư với địa chỉ email: <b className='nhan-manh'>{email}</b>
          </p>
          <div className="parent-success-image">
            <img alt="success" src={successImage} className="success-image" />
          </div>

        </motion.div>}
    </div>
  )
}

export default OtpBox
