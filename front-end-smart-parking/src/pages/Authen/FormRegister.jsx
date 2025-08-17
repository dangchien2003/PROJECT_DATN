import { Button, Divider } from "antd"
import logoGoogle from '@image/logo-google.png'
import { Link } from "react-router-dom"
import InputAuthen from "./InputAuthen"
import { changeInput } from "@/utils/handleChange"
import { useEffect, useState } from "react"
import { useMessageError } from "@/hook/validate"
import { useDispatch, useSelector } from "react-redux"
import { useLoading } from "@/hook/loading"
import { checkRequireInput, validateInput } from "@/utils/validateAction"
import { REGEX_TEMPLATE, TYPE_AUTHEN } from "@/utils/constants"
import { registrationAccount } from "@/service/authenticationService"
import { getDataApi } from "@/utils/api"
import { motion } from "framer-motion";
import successImage from "@image/check.png";
import { cleanUrl, generateCodeChallenge, generateCodeVerifier, getAuthorizationCode } from "@/utils/pkceUtils"
import { getCodeVerifierToLocalStorage, setCodeVerifierToLocalStorage } from "@/service/localStorageService"
import { clientId, googleAuthUrl, redirectUriForSignUp } from "@/configs/googleAuthConfig"

const FormRegister = ({ data }) => {
  const [requireKeys] = useState(["email", "password", "repassword"]);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [regisSuccess, setRegisSuccess] = useState(false);
  const [clickRegis, setClickRegis] = useState(false);
  const fieldError = useSelector((state) => state.fieldError);
  const dispatch = useDispatch();
  const { showLoad, hideLoad } = useLoading();
  const { reset, pushMessage } = useMessageError();

  useEffect(() => {
    reset();
    data.email = null;
    data.password = null;
    data.repassword = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const registration = () => {
    const dataRegis = {};
    if (data.type === TYPE_AUTHEN.USERNAME_PASSWORD) {
      dataRegis.email = data.email;
      dataRegis.password = data.password;
      dataRegis.type = data.type;
    }
    showLoad({ type: 2 })
    registrationAccount(dataRegis)
      .then((response) => {
        processRegisterSuccess(response, dataRegis.type);
      })
      .catch(e => {
        const error = getDataApi(e);
        pushMessage("repassword", error?.message);
      })
      .finally(() => {
        hideLoad();
        setClickRegis(false);
      });
  }

  const processRegisterSuccess = (response, type) => {
    const result = getDataApi(response);
    setRegisSuccess(true);
    data.type = type;
    setEmailSuccess(result);
  }

  const handleChangeInput = (key, value) => {
    changeInput(data, key, value);
  }

  const validateBeforeRequest = () => {
    let pass = true;
    // validate email
    if (!new RegExp(REGEX_TEMPLATE.email).test(data.email)) {
      pushMessage("email", "Email không đúng");
      setClickRegis(false);
      pass = false;
    }
    if (data.password !== data.repassword) {
      pushMessage("repassword", "Mật khẩu không trùng khớp");
      setClickRegis(false);
      pass = false;
    }
    return pass;
  }

  useEffect(() => {
    if (clickRegis) {
      // không thực thi khi có lỗi
      if (!validateInput(fieldError, requireKeys, dispatch)) {
        setClickRegis(false);
        return;
      } else {
        // validate
        if (!validateBeforeRequest()) {
          return;
        }
        data.type = TYPE_AUTHEN.USERNAME_PASSWORD;
        // xử lý tạo tài khoản
        registration();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [clickRegis])

  const handleRegistration = () => {
    checkRequireInput(data, fieldError, pushMessage, requireKeys);
    setClickRegis(true);
  }

  // xử lý đăng nhập bằng google
  useEffect(() => {
    const regisByGooogle = () => {
      const authorizationCode = getAuthorizationCode()
      const codeVerifier = getCodeVerifierToLocalStorage()
      const codeOk = authorizationCode && codeVerifier
      if (!codeOk) {
        return
      }
      const payload = {
        type: TYPE_AUTHEN.GOOGLE,
        codeVerifier,
        authorizationCode
      }
      showLoad({ type: 2 });
      registrationAccount(payload).then(response => {
        processRegisterSuccess(response, payload.type);
      }).catch((error) => {
        const response = getDataApi(error);
        pushMessage("repassword", response?.message);
      }).finally(() => {
        hideLoad();
        cleanUrl();
      });
    }
    regisByGooogle()
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleRegisterByGoogle = async () => {
    const scope = encodeURIComponent('email profile')
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    setCodeVerifierToLocalStorage(codeVerifier)

    const authUrl = `${googleAuthUrl}?response_type=code&redirect_uri=${redirectUriForSignUp}&scope=${scope}&code_challenge=${codeChallenge}&client_id=${clientId}&code_challenge_method=S256`
    window.location.href = authUrl
  }
  return (
    <div>
      <div className='title'>Đăng ký</div>
      <div className='content'>
        {
          !regisSuccess && <>
            <InputAuthen
              fieldName={"email"}
              itemKey={"email"}
              maxLength={100}
              placeholder={"Địa chỉ email"}
              callbackChangeValue={handleChangeInput}
            />
            <InputAuthen
              fieldName={"Mật khẩu"}
              itemKey={"password"}
              maxLength={50}
              minLength={8}
              placeholder={"Mật khẩu"}
              callbackChangeValue={handleChangeInput}
              isPassword={true}
            />
            <InputAuthen
              fieldName={"Xác nhận mật khẩu"}
              itemKey={"repassword"}
              maxLength={50}
              minLength={8}
              placeholder={"Nhập lại mật khẩu"}
              callbackChangeValue={handleChangeInput}
              isPassword={true}
            />
            <div className="action-login">
              <Button type="primary" className="btn login" onClick={handleRegistration}>Đăng ký</Button>
              <Divider className="divider">HOẶC</Divider>
              <Button type="primary" className="btn google-login" onClick={handleRegisterByGoogle}>
                <div>
                  <img className="google-icon" src={logoGoogle} alt="Google logo" />
                  <span>Đăng ký bằng google</span>
                </div>
              </Button>
            </div>
          </>
        }
        {regisSuccess && data.type === TYPE_AUTHEN.USERNAME_PASSWORD &&  <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="success-container"
        >
          <p className="success-notify">
            Bạn đã đăng ký thành công tài khoản với email:
            <br />
            <b className='nhan-manh'>{emailSuccess}</b>
            <br />
            Vui lòng kiểm tra hòm thư để thực hiện xác thực.
          </p>
          <div className="parent-success-image">
            <img alt="success" src={successImage} className="success-image" />
          </div>

        </motion.div>
        }
         {regisSuccess && data.type === TYPE_AUTHEN.GOOGLE &&  <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="success-container"
        >
          <p className="success-notify">
            Bạn đã đăng ký thành công tài khoản với email:
            <br />
            <b className='nhan-manh'>{emailSuccess}</b>
            <br />
            Hãy tiến hành đăng nhập để sử dụng dịch vu.
          </p>
          <div className="parent-success-image">
            <img alt="success" src={successImage} className="success-image" />
          </div>

        </motion.div>
        }
        <div className="parent-link">
          <Link to={regisSuccess ? "/authen?email=" + emailSuccess : "/authen"} className="have-not-account">Quay trở lại đăng nhập!</Link>
        </div>
      </div>
    </div>
  )
}

export default FormRegister
