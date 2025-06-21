import InputError from '@/components/InputError'
import Require from '@/components/Require'
import { useMessageError } from '@/hook/validate'
import { REGEX_TEMPLATE } from '@/utils/constants'
import { validateInput } from '@/utils/validateAction'
import { Button, Input } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const EditPhoneNumber = ({ oldData, itemKey }) => {
  const dispatch = useDispatch();
  const { pushMessage, reset, deleteKey } = useMessageError();
  const keyFocus = useSelector((state) => state.focus);
  const fieldError = useSelector(state => state.fieldError);
  const [newValue, setNewValue] = useState(oldData);
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
    var tmpNewValue = value?.replace("+84", "0");
    var tmpOldValue = oldData?.replace("+84", "0");

    if (tmpNewValue === "" || tmpNewValue === null) {
      pushMessage(itemKey, "Dữ liệu không được trống")
    }
    else if (tmpNewValue === tmpOldValue) {
      pushMessage(itemKey, "Dữ liệu trùng với hiện tại");
    }
    else if (!new RegExp(REGEX_TEMPLATE.phoneNumber).test(value)) {
      pushMessage(itemKey, "Số điện thoại không hợp lệ");
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
  }
  return (
    <div className='edit-name form-edit-account'>
      <div className="label">
        Nhập số điện thoại: <Require />
      </div>
      <Input
        placeholder='Nhập số điện thoại'
        maxLength={12}
        allowClear
        onChange={handleChange}
        value={newValue}
        ref={inputRef}
      />
      <InputError itemKey={itemKey} />
      <div className="warning">
        Vui lòng sử dụng số điện thoại thường xuyên sử dụng để tránh bị đánh cắp tài khoản.
      </div>
      <div className='action'>
        <Button variant='solid' type='primary' onClick={handleSave}>Lưu thông tin</Button>
      </div>
    </div>
  )
}

export default EditPhoneNumber
