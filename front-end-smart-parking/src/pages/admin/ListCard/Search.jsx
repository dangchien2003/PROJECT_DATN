import DatePickerLabelDash from "@/components/DatePickerLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import {
  CARD_TYPE_SELECTBOX,
} from "@/utils/constants";
import { updateObjectValue } from "@/utils/object";
import { Button } from "antd";
import { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
// import dayjs from "dayjs";

const Search = ({ onSearch, dataSearch }) => {
  const {resetRequireField} = useRequireField()
  
  useEffect(()=> {
    console.log("object")
    resetRequireField()
  }, [resetRequireField])

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
          gap: 16,
        }}
      >
        <TextFieldLabelDash
          key={"numberCard"}
          label="Số thẻ"
          defaultValue={""}
          placeholder={"Nhập số thẻ"}
          itemKey="numberCard"
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"emailOwner"}
          label="Email chủ sở hữu"
          defaultValue={""}
          placeholder={"Nhập email chủ sở hữu"}
          itemKey="emailOwner"
          callbackChangeValue={handleChange}
        />
        <SelectBoxLabelDash
          key={"type"}
          itemKey="type"
          label={"Loại thẻ"}
          data={CARD_TYPE_SELECTBOX}
          placeholder={"Chọn trạng thái chỉnh sửa"}
          callbackChangeValue={handleChange}
        />
        <DatePickerLabelDash
          label={"Ngày cấp từ:"}
          itemKey={"issuedDateFrom"}
          placeholder={"Chọn ngày"}
          format="DD/MM/YYYY"
          callbackChangeValue={handleChange}
          // min={dayjs("2025-03-02", "YYYY-MM-DD")}
        />
         <DatePickerLabelDash
          label={"Ngày cấp đến:"}
          itemKey={"issuedDateTo"}
          placeholder={"Chọn ngày"}
          format="DD/MM/YYYY"
          callbackChangeValue={handleChange}
        />
         <TextFieldLabelDash
          key={""}
          label="Người yêu cầu"
          defaultValue={""}
          placeholder={"Nhập tên người yêu cầu"}
          itemKey="requestName"
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
