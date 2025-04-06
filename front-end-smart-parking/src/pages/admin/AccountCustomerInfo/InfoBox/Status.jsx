import ButtonStatus from "@/components/ButtonStatus";
import {
  ACCOUNT_STATUS,
  ACCOUNT_STATUS_OBJECT,
  COLOR_BUTTON_ACCOUNT_STATUS,
} from "@/utils/constants";
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

const Status = ({ info }) => {
  const [inputValue, setInputValue] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);

  const handleChange = (newValue) => {
    setPendingStatus(newValue);
  };

  const handleOk = () => {
    if (!inputValue.trim()) {
      Modal.error({
        title: "Lỗi",
        content: "Vui lòng nhập lý do trước khi xác nhận!",
      });
      return;
    }
    setPendingStatus(null);
    setInputValue("");
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Status;
