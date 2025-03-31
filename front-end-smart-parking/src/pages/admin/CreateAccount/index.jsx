import DividerCustom from "@/components/DividerCustom";
import Account from "./Account";
import { useState } from "react";
import { Button, Checkbox } from "antd";
import Partner from "./Partner";
import PopConfirmCustom from "@/components/PopConfirmCustom";
import { useLoading } from "@/utils/loading";
import { useDispatch } from "react-redux";
import { checkRequireInput, validateInput } from "@/utils/validateAction";

const indexKey = ["fullName", "email", "phoneNumber", "gender"]
const requireKeys = ["fullName", "email", "phoneNumber", "gender"]
const CreateAccount = () => {
  const [data] = useState({
    error: {},
    keyFocus: null 
  })
  const [showBoxPartner, setShowBoxPartner] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const {hideLoad, showLoad} = useLoading()
  const dispatch = useDispatch();

  const handleClickCreate = () => {
    console.log(data)
    // valid data
    checkRequireInput(data, requireKeys);
    if(!validateInput(data.error, indexKey, dispatch)) {
      return
    }
    
    // confirm
    setConfirm(true)
    if(!showBoxPartner) {
      const { partner, ...newData } = data;
      console.log(newData)
    } else {
      console.log(data)
    }
  }

  const onChangeValueCheckbox = (e) => {
    setShowBoxPartner(e.target.checked);
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
    setTimeout(()=> {
      setConfirm(false);
      hideLoad()
    }, 2000)
  }

  const handleCancel = () => {
    setConfirm(false);
  }
  return (
    <div>
      <Account data={data} requireKeys={requireKeys}/>
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
