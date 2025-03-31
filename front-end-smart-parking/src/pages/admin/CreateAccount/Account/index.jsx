import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { DATA_ACCOUNT_STATUS_SELECTBOX, GENDER } from "@/utils/constants";
import { Button } from "antd";
import imgExcel from "@image/excel.png";
import { useState } from "react";
import CreateByExcel from "./CreateByExcel";
import { updateObjectValue } from "@/utils/object";

const Account = ({data, requireKeys}) => {
  const [showViewCreateByExcel, setShowViewCreateByExcel] = useState(false);
  
  const handleClickCreateByExcel = () => {
    setShowViewCreateByExcel(true);
  };

  const handleChange = (value, key) => {
    if (data) {
      updateObjectValue(data, key, value);
    }
    // gọi hàm validate
    switch(key) {
      default: 
    }
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
          itemKey={"fullName"}
          callbackChangeValue={handleChange}
          dataError={data.error}
          requireKeys={requireKeys}
        />
        <TextFieldLabelDash
          label={"Địa chỉ email-Tên đăng nhập"}
          placeholder={"Nhập địa chỉ email"}
          key={"email"}
          itemKey={"email"}
          callbackChangeValue={handleChange}
          dataError={data.error}
          requireKeys={requireKeys}
        />
        <TextFieldLabelDash
          key={"sdt"}
          label="Số điện thoại"
          defaultValue={""}
          placeholder={"Nhập số điện thoại"}
          regex={/^\d{0,9}$/}
          prefix={0}
          itemKey={"phoneNumber"}
          callbackChangeValue={handleChange}
          dataError={data.error}
          maxLength={10}
          minLength={10}
          requireKeys={requireKeys}
        />
        <SelectBoxLabelDash
          itemKey={"gender"}
          label={"Giới tính"}
          data={GENDER}
          key={"gioi tinh"}
          placeholder={"Chọn giới tính"}
          callbackChangeValue={handleChange}
          dataError={data.error}
          requireKeys={requireKeys}
        />
        <SelectBoxLabelDash
          label={"Trạng thái sau khi tạo"}
          data={DATA_ACCOUNT_STATUS_SELECTBOX}
          key={"trang thai"}
          placeholder={"Chọn trạng thái"}
          itemKey={"status"}
          callbackChangeValue={handleChange}
          dataError={data.error}
          requireKeys={requireKeys}
          defaultValue={1}
        />
      </div>
    </div>
  );
};

export default Account;
