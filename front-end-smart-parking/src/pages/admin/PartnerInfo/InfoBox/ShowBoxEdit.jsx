import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { ACCOUNT_CATEGORY, ACCOUNT_CATEGORY_NAME, ACCOUNT_STATUS, GENDER } from "@/utils/constants";
import { Button } from "antd";

const ShowBoxEdit = ({ info }) => {
  return (
    <div>
      <div>
        <h4 style={{ paddingBottom: 8 }}>Thông tin tài khoản</h4>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <TextFieldLabelDash
            label={"Tên tài khoản"}
            placeholder={"Nhập tên tài khoản"}
            key={"ten kh"}
            itemKey={"fullName"}
            defaultValue={info.fullName}
          />
          <TextFieldLabelDash
            label={"Địa chỉ email-Tên đăng nhập"}
            placeholder={"Nhập địa chỉ email"}
            key={"email"}
            defaultValue={info.email}
          />
          <TextFieldLabelDash
            key={"sdt"}
            label="Số điện thoại"
            placeholder={"Nhập số điện thoại"}
            // callbackChangeValue={handleChange}
            regex={/^\d{0,9}$/}
            prefix={0}
            defaultValue={info.phoneNumber}
          />
          <SelectBoxLabelDash
            label={"Giới tính"}
            data={GENDER}
            key={"gioi tinh"}
            placeholder={"Chọn giới tính"}
            defaultValue={info.gender}
          />
          <SelectBoxLabelDash
            label={"Trạng thái"}
            data={ACCOUNT_STATUS}
            key={"trang thai"}
            placeholder={"Chọn trạng thái"}
            defaultValue={info.status}
          />
        </div>
      </div>
      <div>
        <h4 style={{ paddingBottom: 8 }}>Thông tin Đối tác</h4>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <TextFieldLabelDash
            label={"Tên đối tác"}
            placeholder={"Nhập tên đối tác"}
            key={"ten dt"}
            defaultValue={info.partnerFullName}
          />
          <TextFieldLabelDash
            label={"Người đại diện"}
            placeholder={"Nhập người đại diện"}
            key={"nguoi dd"}
            defaultValue={info.representativeFullName}
          />
          <TextFieldLabelDash
            label={"Email liên hệ"}
            placeholder={"Nhập địa chỉ email"}
            key={"email"}
            defaultValue={info.partnerEmail}
          />
          <TextFieldLabelDash
            key={"sdt"}
            label="Số điện thoại"
            placeholder={"Nhập số điện thoại"}
            // callbackChangeValue={handleChange}
            regex={/^\d{0,9}$/}
            prefix={0}
            defaultValue={info.partnerPhoneNumber.substring(1)}
          />
          <TextFieldLabelDash
            label={"Địa chỉ"}
            placeholder={"Nhập địa chỉ"}
            key={"dia chi"}
            defaultValue={info.partnerAddress}
          />
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <Button color="cyan" variant="solid">
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default ShowBoxEdit;
