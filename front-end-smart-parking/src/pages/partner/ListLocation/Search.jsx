import DatePickerFromToLabelDash from "@/components/DatePickerFromToLabelDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import TimeInput from "@/components/TimeInput";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { setSearching } from "@/store/startSearchSlice";
import {
  DATA_LOCATION_WAIT_APPROVE_CATEGORY,
  DATA_OPEN_HOLIDAY,
  DATA_URGENT_APPROVAL_REQUEST,
} from "@/utils/constants";
import { changeInput, changeInputTrend } from "@/utils/handleChange";
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

  const callbackChangeInputTrend = (key, value, trend, skip) => {
    changeInputTrend(dataSearch, key, value, trend, skip);
  }

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
        <TextFieldLabelDash
          key={"name"}
          label="Tên địa điểm"
          defaultValue={""}
          placeholder={"Nhập tên địa điểm"}
          itemKey="name"
          callbackChangeValue={handleChange}
        />
        <TimeInput
          key={"openTime"}
          label="Mở cửa từ"
          defaultValue={""}
          placeholder={"Nhập thời gian mở cửa"}
          itemKey="openTime"
          format="HH:mm"
          callbackChangeValue={handleChange}
        />
        <TimeInput
          key={"closeTime"}
          itemKey="closeTime"
          label="Mở cửa đến"
          defaultValue={""}
          placeholder={"Nhập thời gian đóng cửa"}
          format="HH:mm"
          callbackChangeValue={handleChange}
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
        {[3, 4].includes(dataSearch.tab) && <>
          <DateTimePickerWithSortLabelDash 
            itemKey={"timeAppliedEdit"} 
            key={"timeAppliedEdit"} 
            placeholder={"Chọn ngày áp dụng"} 
            label={"Ngày áp dụng"}
            format={"DD/MM/YYYY HH:mm"}
            formatShowTime={{ format: "HH:mm" }}
            callbackChangeValue={callbackChangeInputTrend}
            defaultValue={dataSearch.timeAppliedEdit}
          />
          <DatePickerFromToLabelDash 
            itemKey={"createdDate"} 
            key={"createdDate"} 
            placeholder={["Từ ngày", "Đến ngày"]} 
            label={"Ngày gửi yêu cầu"}
            // callbackChangeValue={callbackChangeInputTrend}
            defaultValue={dataSearch.createdDate}
          />
          <SelectBoxLabelDash 
            key={"category"}
            itemKey={"category"}
            label={"Phân loại"}
            placeholder={"Chọn phân loại"}
            data={convertObjectToDataSelectBox(DATA_LOCATION_WAIT_APPROVE_CATEGORY)}
            callbackChangeValue={handleChange}
            defaultValue={dataSearch.category}
          />
          <SelectBoxLabelDash 
          key={"urgentApprovalRequest"}
          itemKey={"urgentApprovalRequest"}
          label={"Yêu cầu khẩn cấp"}
          placeholder={"--Chọn--"}
          defaultValue={dataSearch.urgentApprovalRequest}
          data={convertObjectToDataSelectBox(DATA_URGENT_APPROVAL_REQUEST)}
          callbackChangeValue={handleChange}
        />
          {/* <CheckboxWithDash itemKey={"urgentApprovalRequest"} label={"Yêu cầu khẩn cấp"}/> */}
        </>}
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
