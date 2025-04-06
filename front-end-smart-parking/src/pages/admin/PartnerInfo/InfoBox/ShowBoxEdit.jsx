import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { GENDER } from "@/utils/constants";
import { Button } from "antd";

const ShowBoxEdit = ({ info }) => {
  return (
    <div>
      <div>
        <h4 style={{ paddingBottom: 8 }}>Thông tin tài khoản</h4>
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
            label={"Trạng thái"}
            data={GENDER}
            key={"trang thai"}
            placeholder={"Chọn trạng thái"}
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
          />
          <TextFieldLabelDash
            label={"Người đại diện"}
            placeholder={"Nhập người đại diện"}
            key={"nguoi dd"}
          />
          <TextFieldLabelDash
            label={"Email liên hệ"}
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
          <TextFieldLabelDash
            label={"Địa chỉ"}
            placeholder={"Nhập địa chỉ"}
            key={"dia chi"}
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
