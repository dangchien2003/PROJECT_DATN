import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { setSearching } from "@/store/startSearchSlice";
import { DATA_URGENT_APPROVAL_REQUEST } from "@/utils/constants";
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
          // justifyContent: "space-evenly",
          gap: 16,
        }}
      >
        <TextFieldLabelDash
          key={"parnerName"}
          label="Tên đối tác"
          placeholder={"Nhập tên đối tác"}
          itemKey="parnerName"
          callbackChangeValue={handleChange}
          defaultValue={dataSearch.partnerName}
        />
        <DateTimePickerWithSortLabelDash
          label={"Thời gian yêu cầu"}
          itemKey={"createdAt"}
          placeholder={"Chọn thời gian yêu cầu"}
          format="DD/MM/YYYY HH:mm:ss"
          formatShowTime={{ format: "HH:mm:ss" }}
          callbackChangeValue={callbackChangeInputTrend}
          defaultValue={dataSearch.createdAt}
        />
        <DateTimePickerWithSortLabelDash
          label={"Thời gian phát hành/Áp dụng"}
          itemKey={"timeAppliedEdit"}
          placeholder={"Chọn thời gian phát hành"}
          format="DD/MM/YYYY HH:mm"
          formatShowTime={{ format: "HH:mm" }}
          callbackChangeValue={callbackChangeInputTrend}
          defaultValue={dataSearch.timeAppliedEdit}
        />
        {dataSearch.tab !== 5 && <SelectBoxLabelDash 
          key={"urgentApprovalRequest"}
          itemKey={"urgentApprovalRequest"}
          label={"Yêu cầu khẩn cấp"}
          placeholder={"--Chọn--"}
          defaultValue={dataSearch.urgentApprovalRequest}
          data={convertObjectToDataSelectBox(DATA_URGENT_APPROVAL_REQUEST)}
          callbackChangeValue={handleChange}
        />}
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
