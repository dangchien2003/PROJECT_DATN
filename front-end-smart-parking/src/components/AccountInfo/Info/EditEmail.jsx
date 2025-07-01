import InputError from '@/components/InputError'
import ModalCustom from '@/components/ModalCustom'
import Require from '@/components/Require'
import { useMessageError } from '@/hook/validate'
import { REGEX_TEMPLATE } from '@/utils/constants'
import { validateInput } from '@/utils/validateAction'
import { Button, Input } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VerifyOtp from './VerifyOtp'

const EditEmail = ({ oldData, itemKey }) => {
  const dispatch = useDispatch();
  const { pushMessage, reset, deleteKey } = useMessageError();
  const keyFocus = useSelector((state) => state.focus);
  const fieldError = useSelector(state => state.fieldError);
  const [newValue, setNewValue] = useState(oldData);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  useEffect(() => {
    if (keyFocus === itemKey) {
      inputRef.current?.focus();
    }
  }, [keyFocus, itemKey])

  const handleChange = (e) => {
    const value = e.target.value.trim();
    validate(value);
    setNewValue(value);
  }

  const validate = (value) => {
    var pass = false;

    if (value === "" || value === null) {
      pushMessage(itemKey, "Dữ liệu không được trống")
    }
    else if (value === oldData) {
      pushMessage(itemKey, "Dữ liệu không được trùng với hiện tại");
    }
    else if (!new RegExp(REGEX_TEMPLATE.email).test(value)) {
      pushMessage(itemKey, "Email không hợp lệ");
    }
    else {
      deleteKey(itemKey);
      pass = true;
    }

    return pass;
  }

  const handleSave = () => {
    if (!validate(newValue)) {
      if (inputRef.current) {
        inputRef.current?.focus();
      }
      return;
    }
    if (!validateInput(fieldError, [itemKey], dispatch)) {
      return
    }

    setVerifyOtp(true);
  }
  return (
    <div className='edit-name form-edit-account'>
      <div className="label">
        Nhập địa chỉ email: <Require />
      </div>
      <Input
        placeholder='Nhập địa chỉ email'
        maxLength={100}
        allowClear
        onChange={handleChange}
        value={newValue}
        ref={inputRef}
      />
      <InputError itemKey={itemKey} />
      <div className="warning">
        Hãy bảo vệ email cẩn thận để tránh bị đánh cắp tài khoản.
      </div>
      <div className='action'>
        <Button variant='solid' type='primary' onClick={handleSave}>Lưu thông tin</Button>
      </div>
      {verifyOtp && <ModalCustom>
        <VerifyOtp />
      </ModalCustom>}
    </div>
  )
}

export default EditEmail
