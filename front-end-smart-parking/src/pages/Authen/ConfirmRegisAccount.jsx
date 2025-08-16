import { Link, useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import successImage from "@image/check.png";
import error from "@image/close.png";
import './style.css'
import { useEffect, useState } from 'react';
import LineLoading from '@/components/Loading/LineLoading';
import { confirmRegisAccount } from '@/service/authenticationService';
import { getDataApi } from '@/utils/api';

const ConfirmRegisAccount = () => {
  const [param] = useSearchParams();
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState(null);
  useEffect(() => {
    const code = param.get("code");
    if (code) {
      confirmRegisAccount(code).then(response => {
        const email = getDataApi(response);
        setEmail(email);
        setSuccess(true);
      }).catch(e => {
        const response = getDataApi(e);
        setSuccess(false);
        setMessage(response.message);
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div>
      <div className='title'>Xác nhận tài khoản</div>
      <div className='content'>
        {success === true && <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="success-container"
        >
          <p className="success-notify">
            Chúc mừng! Bạn đã xác thực thành công tài khoản:
            <br />
            <b className='nhan-manh'>{email}</b>
            <br />
            <div className="parent-success-image">
              <img alt="success" src={successImage} className="success-image" />
            </div>
            <div className="parent-link">
              <Link to={"/authen?email=" + email||""} className="have-not-account">Đi tới đăng nhập!</Link>
            </div>
          </p>
        </motion.div>
        }
        {success === false && <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="success-container"
        >
          <p className="success-notify">
            Rất tiếc! {message}
            <br />
            <div className="parent-success-image">
              <img alt="error" src={error} className="success-image" />
            </div>
            <div className="parent-link">
              <Link to={"/authen?email=" + email} className="have-not-account">Đi tới đăng nhập!</Link>
            </div>
          </p>
        </motion.div>
        }
        {success === null && <LineLoading />}
      </div>
    </div>
  );
};

export default ConfirmRegisAccount;