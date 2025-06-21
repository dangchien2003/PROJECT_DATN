import InputError from '@/components/InputError'
import Require from '@/components/Require'
import { useMessageError } from '@/hook/validate'
import { validateInput } from '@/utils/validateAction'
import { Button, Radio } from 'antd'
import { useEffect, useState } from 'react'
import { IoMdFemale, IoMdMale } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'

const EditGender = ({ oldData, itemKey }) => {
  const dispatch = useDispatch();
  const { pushMessage, reset, deleteKey } = useMessageError();
  const fieldError = useSelector(state => state.fieldError);
  const [newValue, setNewValue] = useState(oldData);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleChange = (e) => {
    const value = e.target.value;
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
    else {
      deleteKey(itemKey);
      pass = true;
    }

    return pass;
  }

  const handleSave = () => {
    if (!validate(newValue)) {
      return;
    }
    if (!validateInput(fieldError, [itemKey], dispatch)) {
      return
    }
  }
  return (
    <div className='edit-name form-edit-account'>
      <div className="label">
        Chọn giới tính: <Require />
      </div>
      <Radio.Group
        value={newValue}
        options={[
          { value: 0, label: <span><IoMdMale className='gender-male' /> Nam</span> },
          { value: 1, label: <span><IoMdFemale className='gender-female'/> Nữ</span> },
        ]}
        onChange={handleChange}
      />
      <InputError itemKey={itemKey} />
      <div className='action'>
        <Button variant='solid' type='primary' onClick={handleSave}>Lưu thông tin</Button>
      </div>
    </div>
  )
}

export default EditGender
