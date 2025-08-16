import InputError from '@/components/InputError'
import Require from '@/components/Require'
import { useMessageError } from '@/hook/validate'
import { validateInput } from '@/utils/validateAction'
import { Button, Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ideaImg from '@image/idea.png'
import { changeInfo } from '@/service/accountService'
import { getDataApi } from '@/utils/api'
import { toastError, toastSuccess } from '@/utils/toast'
import { useLoading } from '@/hook/loading'

const key = "name";
const EditName = ({ oldData, itemKey, onSuccess }) => {
  const dispatch = useDispatch();
  const { pushMessage, reset, deleteKey } = useMessageError();
  const keyFocus = useSelector((state) => state.focus);
  const fieldError = useSelector(state => state.fieldError);
  const [newValue, setNewValue] = useState(oldData);
  const inputRef = useRef();
  const { showLoad, hideLoad } = useLoading();

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
    const value = e.target.value;
    validate(value);
    setNewValue(value);
  }

  const handleBlur = () => {
    setNewValue(newValue.trim());
  }

  const validate = (value) => {
    value = value.trim();
    var pass = false;
    if (value === "" || value === null) {
      pushMessage(itemKey, "Dữ liệu không được trống")
    }
    else if (value === oldData) {
      pushMessage(itemKey, "Dữ liệu không được trùng với hiện tại");
    } else {
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
    showLoad();
    // call api chỉnh sửa
    changeInfo(key, newValue).then(() => {
      toastSuccess("Thay đổi thông tin thành công");
      onSuccess("fullName", newValue)
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(hideLoad)
  }
  return (
    <div className='edit-name form-edit-account'>
      <div className="label">
        Nhập tên mới: <Require />
      </div>
      <Input
        placeholder='Nhập tên'
        maxLength={255}
        allowClear
        onChange={handleChange}
        onBlur={handleBlur}
        value={newValue}
        ref={inputRef}
      />
      <InputError itemKey={itemKey} />
      <div className='recommand'>
        <img src={ideaImg} alt="recommand" className='icon' />
        <span>Gợi ý sử dụng tên thật hoặc biệt danh</span>
      </div>
      <div className="warning">
        Vui lòng không sử dụng từ ngữ xúc phạm, đả kích cá nhân, tổ chức, quốc gia hoặc trái với thuần phong mỹ tục.
        Mọi vi phạm có thể bị xóa nội dung hoặc khóa tài khoản.
      </div>
      <div className='action'>
        <Button variant='solid' type='primary' onClick={handleSave}>Lưu thông tin</Button>
      </div>
    </div>
  )
}

export default EditName
