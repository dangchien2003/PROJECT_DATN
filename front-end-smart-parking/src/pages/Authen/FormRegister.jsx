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
import { TYPE_AUTHEN } from "@/utils/constants"

const FormRegister = ({ data }) => {
  const [requireKeys] = useState(["username", "password", "repassword"]);
  const [clickRegis, setClickRegis] = useState(false);
  const fieldError = useSelector((state) => state.fieldError);
  const dispatch = useDispatch();
  const { showLoad, hideLoad } = useLoading();
  const { reset, pushMessage } = useMessageError();

  useEffect(() => {
    reset();
    data.username = null;
    data.password = null;
    data.repassword = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const registration = () => {
    const dataRegis = {};
    if (data.type === TYPE_AUTHEN.USERNAME_PASSWORD) {
      dataRegis.username = data.username;
      dataRegis.password = data.password;
      dataRegis.type = data.type;
    }
    showLoad({ type: 2 })
    setTimeout(() => {
      hideLoad();
      setClickRegis(false);
    }, 3000)
  }


  const handleChangeInput = (key, value) => {
    changeInput(data, key, value);
  }
   useEffect(() => {
      if (clickRegis) {
        // không thực thi khi có lỗi
        if (!validateInput(fieldError, requireKeys, dispatch)) {
          setClickRegis(false);
          return;
        } else {
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
  return (
    <div>
      <div className='title'>Đăng ký</div>
      <div className='content'>
        <InputAuthen
          fieldName={"Địa chỉ email/Số điện thoại"}
          itemKey={"username"}
          maxLength={100}
          placeholder={"Địa chỉ email/Số điện thoại"}
          callbackChangeValue={handleChangeInput}
        />
        <InputAuthen
          fieldName={"Mật khẩu"}
          itemKey={"password"}
          maxLength={100}
          placeholder={"Mật khẩu"}
          callbackChangeValue={handleChangeInput}
          isPassword={true}
        />
        <InputAuthen
          fieldName={"Xác nhận mật khẩu"}
          itemKey={"repassword"}
          maxLength={100}
          placeholder={"Nhập lại mật khẩu"}
          callbackChangeValue={handleChangeInput}
          isPassword={true}
        />
        <div className="action-login">
          <Button type="primary" className="btn login" onClick={handleRegistration}>Đăng ký</Button>
          <Divider className="divider">HOẶC</Divider>
          <Button type="primary" className="btn google-login">
            <div>
              <img class="google-icon" src={logoGoogle} alt="Google logo" />
              <span>Đăng nhập bằng google</span>
            </div>
          </Button>
          <Link to={"/authen"} className="have-not-account">Quay trở lại đăng nhập!</Link>
        </div>
      </div>
    </div>
  )
}

export default FormRegister
