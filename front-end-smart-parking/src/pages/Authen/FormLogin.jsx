import { Button, Checkbox, Divider } from "antd"
import logoGoogle from '@image/logo-google.png'
import { Link, useNavigate } from "react-router-dom"
import InputAuthen from "./InputAuthen"
import { changeInput } from "@/utils/handleChange"
import { useMessageError } from "@/hook/validate"
import { useEffect, useState } from "react"
import { checkRequireInput, validateInput } from "@/utils/validateAction"
import { useDispatch, useSelector } from "react-redux"
import { TYPE_AUTHEN } from "@/utils/constants"
import { login } from "@/service/authenticationService"
import { getDataApi } from "@/utils/api"
import { useLoading } from "@/hook/loading"
import { cancelRememberUser, getRememberUser, setAccessToken, setRememberUser } from "@/service/cookieService"
import { setAccountFullName, setAccountId, setActor, setPartnerFullName, setRefreshToken } from "@/service/localStorageService"
import { isNullOrUndefined } from "@/utils/data"

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

  const handleLogin = () => {
    const dataAuthen = {};
    if (data.type === TYPE_AUTHEN.USERNAME_PASSWORD) {
      dataAuthen.username = data.username;
      dataAuthen.password = data.password;
      dataAuthen.type = data.type;
    }
    showLoad({ type: 2 })
    login(dataAuthen).then((response) => {
      const result = getDataApi(response);
      setAccessToken(result?.accessToken);
      setRefreshToken(result?.refreshToken);
      setAccountFullName(result?.fullName);
      setPartnerFullName(result?.partnerFullName);
      setAccountId(result?.id);
      setActor(result?.actor)
      if(remember) {
        setRememberUser(dataAuthen.username);
      } else {
        cancelRememberUser();
      }
      navigate("/admin");
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

  useEffect(() => {
    reset();
    const userRemember = getRememberUser();
    if(!isNullOrUndefined(userRemember)) {
      setRemember(true);
      data.username = userRemember;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

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
    if(authenError) {
      deleteKey(keyAuthenError);
      setAuthenError(false);
    }
  }

  const handleLoginUsernamePassword = () => {
    data.type = TYPE_AUTHEN.USERNAME_PASSWORD;
    if(authenError) {
      pushMessage(keyAuthenError, "Vui lòng điền đúng thông tin")
      return;
    }
    checkRequireInput(data, fieldError, pushMessage, requireKeys);
    setClickLogin(true);
  }

  const handleChangeRemember = (e) => {
    setRemember(e.target.checked)
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
          <Button type="primary" className="btn google-login">
            <div>
              <img className="google-icon" src={logoGoogle} alt="Google logo" />
              <span>Đăng nhập bằng google</span>
            </div>
          </Button>
          <Link to={"/register"} className="have-not-account">Chưa có tài khoản!</Link>
        </div>
      </div>
    </div>
  )
}

export default FormLogin
