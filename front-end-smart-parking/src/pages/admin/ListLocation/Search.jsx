import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import {
  DATA_OPEN_HOLIDAY,
} from "@/utils/constants";
import { updateObjectValue } from "@/utils/object";
import { Button } from "antd";
import { IoSearch } from "react-icons/io5";

const Search = ({ onSearch, dataSearch }) => {
  const handleChange = (value, key) => {
    if (dataSearch) {
      updateObjectValue(dataSearch, key, value);
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          // justifyContent: "space-evenly",
          gap: 16,
        }}
      >
        <TextFieldLabelDash
          key={"parnerName"}
          label="Tên đối tác"
          defaultValue={""}
          placeholder={"Nhập tên đối tác"}
          itemKey="parnerName"
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"name"}
          label="Tên địa điểm"
          defaultValue={""}
          placeholder={"Nhập tên địa điểm"}
          itemKey="name"
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"openTime"}
          label="Mở cửa từ"
          defaultValue={""}
          placeholder={"Nhập thời gian mở cửa"}
          itemKey="openTime"
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"closeTime"}
          itemKey="closeTime"
          label="Mở cửa đến"
          defaultValue={""}
          placeholder={"Nhập thời gian đóng cửa"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"capacity"}
          itemKey="capacity"
          label={"Sức chứa từ"}
          defaultValue={""}
          placeholder={"Nhập sức chứa"}
          callbackChangeValue={handleChange}
          regex={/^-?\d+$/}
        />
        <SelectBoxLabelDash 
          key={"openHoliday"}
          itemKey={"openHoliday"}
          label={"Mở cửa ngày lễ"}
          placeholder={"--Chọn--"}
          defaultValue={0}
          data={DATA_OPEN_HOLIDAY}
          callbackChangeValue={handleChange}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button color="primary" variant="outlined" onClick={onSearch}>
          <IoSearch />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default Search;
