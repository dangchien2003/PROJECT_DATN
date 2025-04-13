import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import TimeInput from "@/components/TimeInput";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { setSearching } from "@/store/startSearchSlice";
import {
  DATA_OPEN_HOLIDAY,
} from "@/utils/constants";
import { changeInput } from "@/utils/handleChange";
import { convertObjectToDataSelectBox } from "@/utils/object";
import { Button } from "antd";
import { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Search = ({ dataSearch }) => {
  const {reset} = useMessageError();
  const {resetRequireField} = useRequireField();
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();

  useEffect(()=> {
    reset();
    resetRequireField();
  }, [resetRequireField, reset])
  

  const handleChange = (key, value) => {
    changeInput(dataSearch, key, value)
  };

  const handleRunSearch = () => {
    if(!isSearching) {
      dispatch(setSearching(true))
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
          defaultValue={dataSearch.partnerName}
          placeholder={"Nhập tên đối tác"}
          itemKey="parnerName"
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"name"}
          label="Tên địa điểm"
          defaultValue={dataSearch.name}
          placeholder={"Nhập tên địa điểm"}
          itemKey="name"
          callbackChangeValue={handleChange}
        />
        <TimeInput
          key={"openTime"}
          label="Mở cửa từ"
          defaultValue={dataSearch.openTime}
          placeholder={"Nhập thời gian mở cửa"}
          itemKey="openTime"
          format="HH:mm"
          callbackChangeValue={handleChange}
        />
        <TimeInput
          key={"closeTime"}
          format="HH:mm"
          itemKey="closeTime"
          label="Mở cửa đến"
          defaultValue={dataSearch.closeTime}
          placeholder={"Nhập thời gian đóng cửa"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"capacity"}
          itemKey="capacity"
          label={"Sức chứa từ"}
          defaultValue={dataSearch.capacity}
          placeholder={"Nhập sức chứa"}
          callbackChangeValue={handleChange}
          regex={/^-?\d+$/}
        />
        <SelectBoxLabelDash 
          key={"openHoliday"}
          itemKey={"openHoliday"}
          label={"Mở cửa ngày lễ"}
          placeholder={"--Chọn--"}
          defaultValue={dataSearch.openHoliday}
          data={convertObjectToDataSelectBox(DATA_OPEN_HOLIDAY)}
          callbackChangeValue={handleChange}
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
