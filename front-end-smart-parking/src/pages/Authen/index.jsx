import './style.css'
import background from '@image/bg_authen.png'
import feature from '@image/image_authen.png'
import FormLogin from './FormLogin';
import LineLoading from '@/components/Loading/LineLoading';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import FormRegister from './FormRegister';
import FormForget from './FormForget';
import { getAccessToken, moveAccessToken } from '@/service/cookieService';
import { deleteRefeshToken } from '@/service/localStorageService';
import { isNullOrUndefined } from '@/utils/data';
import { checkAccessToken } from '@/service/authenticationService';
import { getDataApi } from '@/utils/api';

const Authen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authened, setAuthened] = useState(null);
  const [action, setAction] = useState(null);
  const [data] = useState({
    username: null,
    password: null,
    repassword: null,
    type: null,
  })

  const resetToken = () => {
    moveAccessToken();
    deleteRefeshToken();
  }

  useEffect(() => {
    let idTimeOut = null;
    if (location.pathname === "/register") {
      setAction("REGISTER");
      setAuthened(false);
      resetToken();
    } else if (location.pathname === "/forget"){
      setAction("FORGET");
      setAuthened(false);
      resetToken();
    } else {
    // kiểm tra có token
    // có thì call checktoken
    // không thì xoá token cũ. cho đăng nhập
    // check lỗi thì cho đăng nhập xoá token.
    // token hợp lệ thì đi tới trang chủ
      setAuthened(null); //load
      // xử lý
      const accessToken = getAccessToken();
      if(isNullOrUndefined(accessToken)) {
        setAction("LOGIN");
        setAuthened(false)
        resetToken();
      } else {
        // call check token
        checkAccessToken({token: accessToken}).then(response => {
          const result = getDataApi(response);
          if(result === true) {
            navigate("/admin")
          } else {
            setAction("LOGIN");
            setAuthened(false);
            resetToken();
          }
        })
        .catch(() => {
          setAction("LOGIN");
          setAuthened(false);
          resetToken();
        })
      }
    }

    return () => clearTimeout(idTimeOut);
  }, [location.pathname, navigate])

  return (
    <div
      className='authen'
      style={{
        backgroundImage: `url(${background})`
      }}
    >
      <div className='parent-image'>
        <div className='image'>
          <img src={feature} alt="feature_image" />
        </div>
      </div>
      <div className='form'>
        {authened === null ? (<div style={{ display: "flex", alignItems: "center", marginTop: 200 }}>
          <LineLoading />
          </div>)
          : (
            <>
              {action === "LOGIN" && <AnimatePresence>
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <FormLogin data={data}/>
                </motion.div>
              </AnimatePresence>}
              {action === "REGISTER" && <AnimatePresence>
                <motion.div
                  key="regis-form"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <FormRegister data={data}/>
                </motion.div>
              </AnimatePresence>}
              {action === "FORGET" && <AnimatePresence>
                <motion.div
                  key="forget-form"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <FormForget data={data}/>
                </motion.div>
              </AnimatePresence>}
            </>
          )}
      </div>

    </div>
  )
}

export default Authen
