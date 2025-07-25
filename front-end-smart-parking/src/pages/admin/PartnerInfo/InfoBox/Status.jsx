import ButtonStatus from "@/components/ButtonStatus";
import { useLoading } from "@/hook/loading";
import { changeStatusAccount } from "@/service/accountService";
import { getDataApi } from "@/utils/api";
import {
  ACCOUNT_STATUS,
  ACCOUNT_STATUS_OBJECT,
  COLOR_BUTTON_ACCOUNT_STATUS,
} from "@/utils/constants";
import { toastError, toastSuccess } from "@/utils/toast";
import { Input, Modal, Select } from "antd";
import { useState } from "react";
const renderOptionsSelectBox = () => {
  return ACCOUNT_STATUS.map((item) => {
    return {
      value: item.value,
      label: (
        <ButtonStatus
          label={item.label}
          color={COLOR_BUTTON_ACCOUNT_STATUS[item.value]}
        />
      ),
    };
  });
};

const Status = ({ info, onChangeSuccess }) => {
  const [reason, setReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { showLoad, hideLoad } = useLoading();

  const handleChange = (newValue) => {
    setPendingStatus(newValue);
  };

  const handleOk = () => {
    if (!reason.trim()) {
      setErrorMessage("Vui lòng nhập lý do");
      return;
    }
    showLoad("Đang xử lý");
    setErrorMessage(null);
    changeStatusAccount(info.id, pendingStatus, reason).then(response => {
      toastSuccess("Thay đổi trạng thái thành công");
      setPendingStatus(null);
      const result = getDataApi(response);
      setReason("");
      onChangeSuccess(result);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(() => {
      hideLoad();
    })
  };

  const handleCancel = () => {
    setPendingStatus(null);
  };

  return (
    <div className="d-inline-block">
      <Select
        className="select-status"
        style={{
          width: 180,
        }}
        value={info.status}
        onChange={handleChange}
        options={renderOptionsSelectBox()}
      />
      <div>
        <Modal
          title={`Xác nhận thay đổi trạng thái tài khoản ${info.fullName} thành "${ACCOUNT_STATUS_OBJECT[pendingStatus]}"`}
          open={pendingStatus !== null}
          onCancel={handleCancel}
          onOk={handleOk}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p>Vui lòng nhập lý do:</p>
          <Input
            placeholder="Nhập lý do..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className={"error-field"} style={{ fontSize: 12, padding: 4, color: "red" }}>{errorMessage}</div>
        </Modal>
      </div>
    </div>
  );
};

export default Status;
