import { clientId, googleAuthUrl, redirectUriForSignIn } from "@/configs/googleAuthConfig"
import { useLoading } from "@/hook/loading"
import { useMessageError } from "@/hook/validate"
import { login } from "@/service/authenticationService"
import { cancelRememberUser, getRememberUser, setAccessToken, setRememberUser } from "@/service/cookieService"
import { getCodeVerifierToLocalStorage, setAccountFullName, setAccountId, setActor, setAvatar, setCodeVerifierToLocalStorage, setPartnerFullName, setRefreshToken } from "@/service/localStorageService"
import { authened } from "@/store/authenSlice"
import { getDataApi } from "@/utils/api"
import { TYPE_AUTHEN } from "@/utils/constants"
import { isNullOrUndefined } from "@/utils/data"
import { changeInput } from "@/utils/handleChange"
import { cleanUrl, generateCodeChallenge, generateCodeVerifier, getAuthorizationCode } from "@/utils/pkceUtils"
import { checkRequireInput, validateInput } from "@/utils/validateAction"
import logoGoogle from '@image/logo-google.png'
import { Button, Checkbox, Divider } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import InputAuthen from "./InputAuthen"

const keyAuthenError = "password"
const FormLogin = ({ data }) => {
  const [requireKeys] = useState(["username", "password"]);
  const [clickLogin, setClickLogin] = useState(false);
  const [remember, setRemember] = useState(false);
  const [authenError, setAuthenError] = useState(false);
  const { reset, pushMessage, deleteKey } = useMessageError();
  const fieldError = useSelector((state) => state.fieldError);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showLoad, hideLoad } = useLoading();
  const [params] = useSearchParams();

  useEffect(() => {
    reset();
    const email = params.get("email");
    if (email !== null) {
      data.username = email;
    } else {
      const userRemember = getRememberUser();
      if (!isNullOrUndefined(userRemember)) {
        setRemember(true);
        data.username = userRemember;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  // xử lý đăng nhập bằng google
  useEffect(() => {
    const loginByGooogle = async () => {
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
      showLoad({ type: 2 })
      try {
        const response = await login(payload);
        processLoginSuccess(response, {});
      } catch (error) {
        const response = getDataApi(error);
        pushMessage(keyAuthenError, response.message);
        setAuthenError(true);
      } finally {
        cleanUrl();
        hideLoad();
      }
    }
    loginByGooogle()
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleLogin = () => {
    const dataAuthen = {};
    if (data.type === TYPE_AUTHEN.USERNAME_PASSWORD) {
      dataAuthen.username = data.username;
      dataAuthen.password = data.password;
      dataAuthen.type = data.type;
    }
    showLoad({ type: 2 })
    login(dataAuthen).then((response) => {
      processLoginSuccess(response, dataAuthen);
    })
      .catch((e) => {
        const error = getDataApi(e);
        pushMessage(keyAuthenError, error.message);
        setAuthenError(true);
      })
      .finally(() => {
        hideLoad();
        setClickLogin(false);
      })
  }

  const processLoginSuccess = (response, dataAuthen) => {
    dispatch(authened(true));
    const result = getDataApi(response);
    setAccessToken(result?.accessToken);
    setRefreshToken(result?.refreshToken);
    setAccountFullName(result?.fullName);
    setPartnerFullName(result?.partnerFullName);
    setAccountId(result?.id);
    setActor(result?.actor)
    setAvatar(result?.avatar ? result.avatar : "")
    if (remember) {
      setRememberUser(dataAuthen.username);
    } else {
      cancelRememberUser();
    }
    if (result?.actor === "partner") {
      navigate("/partner");
    } else if (result?.actor === "admin") {
      navigate("/admin");
    } else if (result?.actor === "customer") {
      navigate("/home")
    } else {
      navigate("/404")
    }
  }

  useEffect(() => {
    if (clickLogin) {
      // không thực thi khi có lỗi
      if (!validateInput(fieldError, requireKeys, dispatch)) {
        setClickLogin(false);
        return;
      } else {
        // login
        handleLogin();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [clickLogin])

  const handleChangeInput = (key, value) => {
    changeInput(data, key, value);
    if (authenError) {
      deleteKey(keyAuthenError);
      setAuthenError(false);
    }
  }

  const handleLoginUsernamePassword = () => {
    data.type = TYPE_AUTHEN.USERNAME_PASSWORD;
    if (authenError) {
      pushMessage(keyAuthenError, "Vui lòng điền đúng thông tin")
      return;
    }
    checkRequireInput(data, fieldError, pushMessage, requireKeys);
    setClickLogin(true);
  }

  const handleChangeRemember = (e) => {
    setRemember(e.target.checked)
  }

  const handleLoginByGoogle = async () => {
    const scope = encodeURIComponent('email profile')
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    setCodeVerifierToLocalStorage(codeVerifier)

    const authUrl = `${googleAuthUrl}?response_type=code&redirect_uri=${redirectUriForSignIn}&scope=${scope}&code_challenge=${codeChallenge}&client_id=${clientId}&code_challenge_method=S256`
    window.location.href = authUrl
  }
  return (
    <div>
      <div className='title'>Đăng nhập</div>
      <div className='content'>
        <InputAuthen
          fieldName={"Địa chỉ email/Số điện thoại"}
          itemKey={"username"}
          maxLength={100}
          placeholder={"Địa chỉ email/Số điện thoại"}
          callbackChangeValue={handleChangeInput}
          defaultValue={data.username}
        />
        <InputAuthen
          fieldName={"Mật khẩu"}
          itemKey={"password"}
          maxLength={100}
          placeholder={"Mật khẩu"}
          callbackChangeValue={handleChangeInput}
          isPassword={true}
        />
        <div className="action-other">
          <Checkbox className="checkbox" checked={remember} onChange={handleChangeRemember}>Nhớ mật khẩu</Checkbox>
          <Link to={"/forget"}>Quên mật khẩu?</Link>
        </div>
        <div className="action-login">
          <Button type="primary" className="btn login" onClick={handleLoginUsernamePassword}>Đăng nhập</Button>
          <Divider className="divider">HOẶC</Divider>
          <Button type="primary" className="btn google-login" onClick={handleLoginByGoogle}>
            <div>
              <img className="google-icon" src={logoGoogle} alt="Google logo" />
              <span>Đăng nhập bằng google</span>
            </div>
          </Button>
          <div className="parent-link">
            <Link to={"/register"} className="have-not-account">Chưa có tài khoản!</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormLogin
