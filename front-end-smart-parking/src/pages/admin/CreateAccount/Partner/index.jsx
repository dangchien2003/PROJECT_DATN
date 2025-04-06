import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { updateObjectValue } from "@/utils/object";

const Partner = ({data}) => {
  const handleChange = (value, key) => {
    if (data) {
      updateObjectValue(data, key, value);
    }
  };
  return (
    <div>
      <h4 style={{ paddingBottom: 8 }}>Thông tin đối tác</h4>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <TextFieldLabelDash
          label={"Tên đối tác"}
          placeholder={"Nhập tên đối tác"}
          key={"ten dt"}
          itemKey={"partner.partnerFullName"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          label={"Người đại diện"}
          placeholder={"Nhập người đại diện"}
          key={"nguoi dd"}
          itemKey={"partner.representativeFullName"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          label={"Email liên hệ"}
          placeholder={"Nhập địa chỉ email"}
          key={"email"}
          itemKey={"partner.email"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"sdt"}
          label="Số điện thoại"
          defaultValue={""}
          placeholder={"Nhập số điện thoại"}
          // callbackChangeValue={handleChange}
          regex={/^\d{0,9}$/}
          prefix={0}
          itemKey={"partner.phoneNumber"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          label={"Địa chỉ"}
          placeholder={"Nhập địa chỉ"}
          key={"dia chi"}
          itemKey={"partner.address"}
          callbackChangeValue={handleChange}
        />
      </div>
    </div>
  );
};

export default Partner;
