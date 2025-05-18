import { Button, Flex } from "antd"
import { Link, useSearchParams } from "react-router-dom"
import InputAuthen from "./InputAuthen"
import { changeInput } from "@/utils/handleChange"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLoading } from "@/hook/loading"
import { useMessageError } from "@/hook/validate"
import { checkRequireInput, validateInput } from "@/utils/validateAction"
import { TYPE_AUTHEN, USERNAME_CATEGORY } from "@/utils/constants"
import { motion } from "framer-motion";
import OtpBox from "./OtpBox"
import CountDown from "@/components/CountDown"
import dayjs from 'dayjs'
import { forgetAccount } from "@/service/authenticationService"
import { getDataApi } from "@/utils/api"

const FormForget = ({ data }) => {
  const [requireKeys] = useState(["username"]);
  const [forgetSuccess, setForgetSuccess] = useState(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [clickForget, setClickForget] = useState(false);
  const [sizeOtp, setSizeOtp] = useState(null);
  const [expire, setExpire] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [category, setCategory] = useState(null);
  const [timeOutId, setTimeOutId] = useState(null);
  const fieldError = useSelector((state) => state.fieldError);
  const dispatch = useDispatch();
  const { showLoad, hideLoad } = useLoading();
  const { reset, pushMessage } = useMessageError();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    reset();
    const username = searchParams.get('username');
    if (username !== null) {
      data.username = username;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const handleChangeInput = (key, value) => {
    changeInput(data, key, value);
  }

  const forget = () => {
    showLoad({ type: 2 })
    forgetAccount(data.username).then((response) => {
      const result = getDataApi(response);
      setSizeOtp(result?.length);
      const expireDayjs = dayjs(result.expire);
      setExpire(dayjs(expireDayjs));
      setAccountId(result.id);
      setForgetSuccess(true);
      setCategory(result.category);
      // reset nếu hết thời hạn
      const id = setTimeout(() => {
        console.log("object")
        setSizeOtp(null);
        setExpire(dayjs(null));
        setAccountId(null);
        setForgetSuccess(false);
        setCategory(null);
      }, (expireDayjs.valueOf() - dayjs().valueOf()))
      setTimeOutId(id);
    })
      .catch((e) => {
        const error = getDataApi(e);
        pushMessage("username", error?.message);
      })
      .finally(() => {
        hideLoad();
      })
  }

  useEffect(() => {
    if (clickForget) {
      setClickForget(false);
      // không thực thi khi có lỗi
      if (!validateInput(fieldError, requireKeys, dispatch)) {
        setClickForget(false);
        return;
      } else {
        data.type = TYPE_AUTHEN.USERNAME_PASSWORD;
        // xử lý tạo tài khoản
        forget();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [clickForget])

  const handleforget = () => {
    checkRequireInput(data, fieldError, pushMessage, requireKeys);
    setClickForget(true);
  }

  const onConfirmSuccess = () => {
    setConfirmSuccess(true);
  }
  return (
    <div>
      <div className='title'>Quên mật khẩu</div>
      <div className='content'>
        {forgetSuccess === null &&
          <>
            <InputAuthen
              fieldName={"Tên đăng nhập"}
              itemKey={"username"}
              maxLength={100}
              placeholder="Địa chỉ email/Số điện thoại"
              callbackChangeValue={handleChangeInput}
              defaultValue={data.username}
            />
            <div className="action-login">
              <Button type="primary" className="btn login" onClick={handleforget}>Gửi thông tin</Button>
            </div>
          </>}
        {forgetSuccess === true && <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="success-container"
        >
          {!confirmSuccess && <p className="success-notify">
            Bạn đã yêu cầu cài lại mật khẩu thành công.
            <br />Vui lòng kiểm tra
            {category === USERNAME_CATEGORY.email && " hòm thư "}
            {category === USERNAME_CATEGORY.phoneNumber && " tin nhắn SMS "}
            và nhập mã xác nhận.
            <br />
            <b className="nhan-manh">{data.username}</b>
          </p>
          }

          <OtpBox size={sizeOtp} id={accountId} timeOutId={timeOutId} onConfirmSuccess={onConfirmSuccess} />
          {!confirmSuccess && <Flex justify='center' style={{ paddingTop: 8 }}>
            <Flex>
              <span style={{ paddingRight: 4 }}>Thời gian còn lại:</span><CountDown start={dayjs()} end={expire} />
            </Flex>
          </Flex>
          }
        </motion.div>
        }
        {forgetSuccess === false && <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="success-container"
        >
          <p className="success-notify">
            Đã hết thời gian xác nhận.<br /> Vui lòng thực hiện lại thao tác
          </p>
          <div className="parent-link">
            <a href={"/forget?username=" + data.username} className="have-not-account">
              <Button type="primary" className="btn reforget">Thực hiện lại</Button>
            </a>
          </div>
        </motion.div>
        }
        <div className="parent-link">
          <Link to={"/authen"} className="have-not-account">Quay trở lại đăng nhập!</Link>
        </div>
      </div>
    </div>
  )
}

export default FormForget
