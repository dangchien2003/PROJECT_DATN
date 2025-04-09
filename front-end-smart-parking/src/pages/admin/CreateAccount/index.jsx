import DividerCustom from "@/components/DividerCustom";
import Account from "./Account";
import { useEffect, useState } from "react";
import { Button, Checkbox } from "antd";
import Partner from "./Partner";
import PopConfirmCustom from "@/components/PopConfirmCustom";
import { useLoading } from "@/hook/loading";
import { useDispatch, useSelector } from "react-redux";
import { checkRequireInput, validateInput } from "@/utils/validateAction";
import { useMessageError } from "@/hook/validate";
import { useRequireField } from "@/hook/useRequireField";
import { createAccountByAdmin } from "@/service/accountService";
import { ACCOUNT_CATEGORY } from "@/utils/constants";
import { toastError, toastSuccess } from "@/utils/toast";

const indexKeyAccount = ["fullName", "email", "phoneNumber", "gender", "status"];
const indexKeyPartner = ["partnerFullName", "partnerEmail"];
const indexKey = indexKeyAccount.concat(indexKeyPartner);
const partnerRequireKeys = ["partnerFullName", "partnerEmail"]
const CreateAccount = () => {
  const [data] = useState({status: 1});
  const [showBoxPartner, setShowBoxPartner] = useState(false);
  const [clickCreate, setClickCreate] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const {hideLoad, showLoad} = useLoading();
  const dispatch = useDispatch();
  const fieldError = useSelector(state => state.fieldError);
  const requireKeys = useSelector(state => state.requireField);
  const {pushMessage, deleteManyKey, reset} = useMessageError();
  const {pushRequireField, deleteRequireField, resetRequireField} = useRequireField();

  useEffect(() => {
    reset();
    resetRequireField();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleActionCreate = () => {
    if(!validateInput(fieldError, indexKey, dispatch)) {
        return
    }
    // confirm
    setConfirm(true)
  }

  useEffect(() => {
    if(clickCreate) {
      handleActionCreate()
      setClickCreate(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickCreate])
  
  const saveData = (dataSave) => {
    createAccountByAdmin(dataSave)
    .then(() => {
      toastSuccess("Tạo mới thành công")
    })
    .catch(e => {
      const objectError = e.response?.data
      toastError(objectError?.message)
    })
    .finally(()=> {
      hideLoad();
    })
  }

  const handleClickCreate = () => {
    // valid data
    checkRequireInput(data, fieldError, pushMessage, requireKeys);
    setClickCreate(true)
  }

  const onChangeValueCheckbox = (e) => {
    setShowBoxPartner(e.target.checked);
    // set key bắt buộc nhập
    if(e.target.checked) {
      pushRequireField(partnerRequireKeys);
    } else {
      deleteRequireField(partnerRequireKeys);
      deleteManyKey(indexKeyPartner)
    }
  }

  const getTitlePopConfirm = () => {
    if(showBoxPartner) {
      return 'Bạn có muốn tiếp tục tạo tài khoản đối tác "' + data.fullName?.toUpperCase() +'" không?'
    }else {
      return 'Bạn có muốn tiếp tục tạo tài khoản khách hàng "' + data.fullName?.toUpperCase() +'" không?'
    }
  }

  const handleOk = () => {
    showLoad("Đang xử lý")
    setConfirm(false);
    // lấy dữ liệu payload
    if(!showBoxPartner) {
      const { partner, ...newData } = data;
      newData.category = ACCOUNT_CATEGORY.CUSTOMER;
      saveData(newData);
    } else {
      data.category = ACCOUNT_CATEGORY.PARTNER;
      saveData(data);
    }
  }

  const handleCancel = () => {
    setConfirm(false);
  }
  return (
    <div>
      <Account data={data}/>
      <div>
        <Checkbox
          onChange={onChangeValueCheckbox}
        >
          Tạo cho đối tác
        </Checkbox>
      </div>
      {showBoxPartner && <DividerCustom />}
      <div style={!showBoxPartner ? { display: "none" } : {}}>
        <Partner data={data}/>
      </div>
      {/* nút */}
      <div style={{ textAlign: "right" }}>
        <Button color="cyan" variant="solid" onClick={handleClickCreate}>
          Tạo
        </Button>
      </div>
      {confirm && <PopConfirmCustom title={getTitlePopConfirm()} handleCancel={handleCancel} handleOk={handleOk}/>}
    </div>
  );
};

export default CreateAccount;
