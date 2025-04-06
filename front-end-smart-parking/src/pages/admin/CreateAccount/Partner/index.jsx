import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { changeInput } from "@/utils/handleChange";

const Partner = ({data}) => {
  const handleChange = (key, value) => {
    changeInput(data, key, value);
  };
  return (
    <div>
      <h4 style={{ paddingBottom: 8 }}>Thông tin đối tác</h4>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <TextFieldLabelDash
          label={"Tên đối tác"}
          placeholder={"Nhập tên đối tác"}
          key={"ten dt"}
          itemKey={"partnerFullName"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          label={"Người đại diện"}
          placeholder={"Nhập người đại diện"}
          key={"nguoi dd"}
          itemKey={"representativeFullName"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          label={"Email liên hệ"}
          placeholder={"Nhập địa chỉ email"}
          key={"partnerEmail"}
          itemKey={"partnerEmail"}
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
          itemKey={"partnerPhoneNumber"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          label={"Địa chỉ"}
          placeholder={"Nhập địa chỉ"}
          key={"dia chi"}
          itemKey={"partnerAddress"}
          callbackChangeValue={handleChange}
        />
      </div>
    </div>
  );
};

export default Partner;
