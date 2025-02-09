import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { GENDER } from "@/utils/constants";
import { Button } from "antd";
import imgExcel from "@image/excel.png";
import { useState } from "react";
import CreateByExcel from "./CreateByExcel";
const Account = () => {
  const [showViewCreateByExcel, setShowViewCreateByExcel] = useState(false);
  const handleClickCreateByExcel = () => {
    setShowViewCreateByExcel(true);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <h4 style={{ paddingBottom: 8 }}>Thông tin tài khoản</h4>
        <div>
          <Button
            color="cyan"
            variant="outlined"
            shape="round"
            style={{ fontSize: 14 }}
            onClick={handleClickCreateByExcel}
          >
            <img src={imgExcel} alt="excel" width={10} />
            Tạo bằng excel
          </Button>
        </div>
      </div>
      {showViewCreateByExcel && (
        <CreateByExcel setShowViewCreateByExcel={setShowViewCreateByExcel} />
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <TextFieldLabelDash
          label={"Tên khách hàng"}
          placeholder={"Nhập tên khách hàng"}
          key={"ten kh"}
        />
        <TextFieldLabelDash
          label={"Địa chỉ email-Tên đăng nhập"}
          placeholder={"Nhập địa chỉ email"}
          key={"email"}
        />
        <TextFieldLabelDash
          key={"sdt"}
          label="Số điện thoại"
          defaultValue={""}
          placeholder={"Nhập số điện thoại"}
          // callbackChangeValue={handleChange}
          regex={/^\d{0,9}$/}
          prefix={0}
        />
        <SelectBoxLabelDash
          label={"Giới tính"}
          data={GENDER}
          key={"gioi tinh"}
          placeholder={"Chọn giới tính"}
        />
        <SelectBoxLabelDash
          label={"Trạng thái sau khi tạo"}
          data={GENDER}
          key={"trang thai"}
          placeholder={"Chọn trạng thái"}
        />
      </div>
    </div>
  );
};

export default Account;
