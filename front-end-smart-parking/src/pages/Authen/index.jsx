import LineLoading from '@/components/Loading/LineLoading';
import { checkAccessToken } from '@/service/authenticationService';
import { getAccessToken, moveAccessToken } from '@/service/cookieService';
import { deleteRefeshToken, getActor } from '@/service/localStorageService';
import { getDataApi } from '@/utils/api';
import { isNullOrUndefined } from '@/utils/data';
import background from '@image/bg_authen.png';
import feature from '@image/image_authen.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormForget from './FormForget';
import FormLogin from './FormLogin';
import FormRegister from './FormRegister';
import './style.css';

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
            var url = null;
            const actor = getActor();
            if(actor === 'admin') {
              url= "/admin"
            } else if(actor === 'partner') {
              url= "/partner"
            } else {
              url= "/"
            }
            navigate(url)
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
