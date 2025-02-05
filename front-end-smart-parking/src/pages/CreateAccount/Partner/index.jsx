import TextFieldLabelDash from "@/components/TextFieldLabelDash";

const Partner = () => {
  return (
    <div>
      <h4 style={{ paddingBottom: 8 }}>Thông tin đối tác</h4>
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
  );
};

export default Partner;
