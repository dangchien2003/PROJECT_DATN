import { Button, Input } from "antd"
import { Link } from "react-router-dom"

const FormForget = () => {
  return (
    <div>
      <div className='title'>Quên mật khẩu</div>
      <div className='content'>
        <Input className="input-authen" placeholder="Địa chỉ email/Số điện thoại" />
        <div className="action-login">
          <Button type="primary" className="btn login">Gửi thông tin</Button>
          <Link to={"/authen"} className="have-not-account">Quay trở lại đăng nhập!</Link>
        </div>
      </div>
    </div>
  )
}

export default FormForget
