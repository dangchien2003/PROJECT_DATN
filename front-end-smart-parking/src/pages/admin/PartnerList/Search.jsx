import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { ACCOUNT_STATUS } from "@/utils/constants";
import { Button } from "antd";
import { IoSearch } from "react-icons/io5";

const Search = () => {
  const handleChange = (value) => {
    console.log(value);
  };

  const handleRunSearch = () => {
    console.log("click");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          // gap: 16,
        }}
      >
        <TextFieldLabelDash
          key={"name"}
          label="Tên đối tác"
          defaultValue={""}
          placeholder={"Tên đối tác"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"email"}
          label="Địa chỉ email"
          defaultValue={""}
          placeholder={"Nhập địa chỉ email"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"sdt"}
          label="Số điện thoại"
          defaultValue={""}
          placeholder={"Nhập số điện thoại"}
          callbackChangeValue={handleChange}
          regex={/^\d{0,9}$/}
          prefix={0}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          // gap: 16,
        }}
      >
        <SelectBoxLabelDash
          label={"Trạng thái tài khoản"}
          data={ACCOUNT_STATUS}
          key={"trang thai"}
          placeholder={"Chọn trạng thái"}
        />
        <SelectBoxLabelDash
          label={"Vai trò"}
          data={ACCOUNT_STATUS}
          key={"vai tro"}
          placeholder={"Chọn vai trò"}
        />
        <SelectBoxLabelDash
          label={"Quyền truy cập"}
          data={ACCOUNT_STATUS}
          key={"quyen truy cap"}
          placeholder={"Chọn quyền truy cập"}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button color="primary" variant="outlined" onClick={handleRunSearch}>
          <IoSearch />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default Search;
