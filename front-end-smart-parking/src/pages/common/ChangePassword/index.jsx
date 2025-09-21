import PopConfirmCustom from '@/components/PopConfirmCustom';
import TextFieldLabelDash from '@/components/TextFieldLabelDash';
import { useLoading } from '@/hook/loading';
import { useRequireField } from '@/hook/useRequireField';
import { useMessageError } from '@/hook/validate';
import { changePassword } from '@/service/accountService';
import { getDataApi } from '@/utils/api';
import { lineLoading } from '@/utils/constants';
import { changeInput } from '@/utils/handleChange';
import { toastError, toastSuccess } from '@/utils/toast';
import { checkRequireInput, validateInput } from '@/utils/validateAction';
import { Button, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
const indexRequireKey = ["oldPassword", "newPassword", "reNewPassword"]
const ChangePassword = () => {
  const dispatch = useDispatch();
  const { hideLoad, showLoad } = useLoading();
  const { setRequireField } = useRequireField();
  const { reset, pushMessage } = useMessageError();
  const fieldError = useSelector(state => state.fieldError);
  const [processChange, setProcessChange] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setRequireField(indexRequireKey);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const [data] = useState(
    {
      oldPassword: null,
      newPassword: null,
      reNewPassword: null
    }
  );
  const onChange = (key, value) => {
    changeInput(data, key, value);
  }

  useEffect(() => {
    if (processChange) {
      setProcessChange(false)
      if (!validateInput(fieldError, indexRequireKey, dispatch)) {
        return
      }
      if (data.oldPassword === data.newPassword) {
        pushMessage("newPassword", "Mật khẩu mới không được giống hiện tại");
        return;
      }
      if (data.newPassword !== data.reNewPassword) {
        pushMessage("reNewPassword", "Mật khẩu không khớp");
        return;
      }
      setConfirm(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processChange])

  const handleChange = () => {
    checkRequireInput(data, fieldError, pushMessage, indexRequireKey);
    setProcessChange(true)
  }

  const handleOK = () => {
    showLoad(lineLoading);
    changePassword(data.oldPassword, data.newPassword).then(response => {
      toastSuccess("Thay đổi mật khẩu thành công");
      setConfirm(false);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(hideLoad)
  }

  const handleCancel = () => {
    setConfirm(false);
  }
  return (
    <div className='change-password'>
      <h1 class="page-name">Đổi mật khẩu</h1>
      <Flex justify='center'>
        <div>
          <div style={{ textAlign: "left" }}>
            <TextFieldLabelDash
              label={"Mật khẩu cũ"}
              itemKey={"oldPassword"}
              isPassword={true}
              callbackChangeValue={onChange}
            />
            <TextFieldLabelDash
              label={"Mật khẩu mới"}
              itemKey={"newPassword"}
              isPassword={true}
              maxLength={20}
              minLength={8}
              callbackChangeValue={onChange}
            />
            <TextFieldLabelDash
              label={"Nhập lại mật khẩu mới"}
              itemKey={"reNewPassword"}
              isPassword={true}
              maxLength={20}
              minLength={8}
              callbackChangeValue={onChange}
            />
          </div>
          <Button variant='filled' type='primary' onClick={handleChange}>Thay đổi</Button>
        </div>
      </Flex>
      {confirm && <PopConfirmCustom title={"Bạn có chắc chắn muốn thay đổi mật khẩu không?"} type={"warning"} handleOk={handleOK} handleCancel={handleCancel} />}
    </div>
  );
};

export default ChangePassword;