import DatePickerFromToLabelDash from "@/components/DatePickerFromToLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { setSearching } from "@/store/startSearchSlice";
import {
  CARD_TYPE_SELECTBOX,
} from "@/utils/constants";
import { updateObjectValue } from "@/utils/object";
import { Button } from "antd";
import { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Search = ({ dataSearch }) => {
  const { reset } = useMessageError();
  const { resetRequireField } = useRequireField();
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();

  useEffect(() => {
    reset();
    resetRequireField();
  }, [resetRequireField, reset])

  const handleChange = (key, value) => {
    if (dataSearch) {
      updateObjectValue(dataSearch, key, value);
    }
  };

  const handleClickSearch = () => {
    if (!isSearching) {
      dispatch(setSearching(true))
    }
  }
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
        <DatePickerFromToLabelDash
          label={"Ngày cấp từ:"}
          itemKey={"issuedDate"}
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
        <Button color="primary" variant="outlined" onClick={handleClickSearch}>
          <IoSearch />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default Search;
