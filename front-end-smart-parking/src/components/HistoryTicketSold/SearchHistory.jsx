import DatePickerFromToLabelDash from "@/components/DatePickerFromToLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { setSearching } from "@/store/startSearchSlice";
import { changeInput } from "@/utils/handleChange";
import { Button } from "antd";
import { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const dataComboboxTinhTrang = [
  {
    label: "Chưa có hiệu lực",
    value: 1
  },
  {
    label: "Còn hiệu lực",
    value: 2
  },
  {
    label: "Hết hiệu lực",
    value: 3
  }
]


const SearchHistory = ({ dataSearch }) => {
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
          gap: 16,
        }}
      >
        <DatePickerFromToLabelDash 
          label={"Ngày bán"}
          format="DD/MM/YYYY"
          itemKey={"buyDate"}
          callbackChangeValue={handleChange}
        />
        <DatePickerFromToLabelDash 
          label={"Thời gian hiệu lực"}
          format="DD/MM/YYYY"
          itemKey={"useDate"}
          callbackChangeValue={handleChange}
        />
        <SelectBoxLabelDash
          label={"Trình trạng"}
          placeholder={"Chọn tình trạng"}
          data={dataComboboxTinhTrang}
          itemKey={"status"}
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

export default SearchHistory;
