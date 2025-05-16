import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import NumberInputWithSortLabelDash from "@/components/NumberInputWithSortLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import {
  PRICE_CATEGORY,
  TICKET_MODIFY_STATUS,
  VEHICLE,
} from "@/utils/constants";
import { convertObjectToDataSelectBox } from "@/utils/object";
import { Button } from "antd";
import { IoSearch } from "react-icons/io5";
import { useMessageError } from "@/hook/validate";
import { useRequireField } from "@/hook/useRequireField";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setSearching } from "@/store/startSearchSlice";
import { changeInput, changeInputTrend } from "@/utils/handleChange";
import { isNullOrUndefined } from "@/utils/data";

const Search = ({ dataSearch }) => {
  const { pushMessage, reset } = useMessageError();
  const { resetRequireField } = useRequireField();
  const { isSearching } = useSelector(state => state.startSearch)
  const [requriePrice, setRequirePrice] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    reset();
    resetRequireField();
  }, [resetRequireField, reset])

  const handleChange = (key, value) => {
    changeInput(dataSearch, key, value)
    if (key === "priceCategory") {
      if (value !== undefined) {
        setRequirePrice(true);
      } else {
        setRequirePrice(false);
      }
    }
  };
  const callbackChangeInputTrend = (key, value, trend, skip) => {
    changeInputTrend(dataSearch, key, value, trend, skip);
    if (key === "priceSearch") {
      if (value !== null || !isNullOrUndefined(dataSearch.priceCategory)) {
        setRequirePrice(true);
      } else {
        setRequirePrice(false);
      }
    }
  };

  const handleRunSearch = () => {
    let pass = true;
    if (requriePrice) {
      if (isNullOrUndefined(dataSearch?.priceSearch?.value)) {
        pushMessage("priceSearch", "Bắt buộc nhập");
        pass = false;
      }
      if (isNullOrUndefined(dataSearch.priceCategory)) {
        pushMessage("priceCategory", "Bắt buộc nhập");
        pass = false;
      }
    }
    
    if (!isSearching && pass) {
      dispatch(setSearching(true));
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
          key={"name"}
          label="Tên vé"
          defaultValue={dataSearch.name}
          placeholder={"Nhập tên vé"}
          itemKey="ticketName"
          callbackChangeValue={handleChange}
        />
        <SelectBoxLabelDash
          label={"Trạng thái chỉnh sửa"}
          data={convertObjectToDataSelectBox(TICKET_MODIFY_STATUS)}
          defaultValue={dataSearch.modifyStatus}
          key={"modify status"}
          itemKey="modifyStatus"
          placeholder={"Chọn trạng thái chỉnh sửa"}
          callbackChangeValue={handleChange}
        />
        <DateTimePickerWithSortLabelDash
          label={"Thời gian phát hành"}
          itemKey={"releasedTime"}
          defaultValue={dataSearch.releasedTime}
          placeholder={"Chọn thời gian phát hành"}
          format="DD/MM/YYYY HH:mm"
          formatShowTime={{ format: "HH:mm" }}
          callbackChangeValue={callbackChangeInputTrend}
        />
        <NumberInputWithSortLabelDash
          label={"Giá vé"}
          min={-10}
          max={1000000000}
          itemKey={"priceSearch"}
          defaultValue={dataSearch.priceSearch}
          placeholder={"Nhập giá vé"}
          callbackChangeValue={callbackChangeInputTrend}
          require={requriePrice}
          addonAfter="đ"
        />
        <SelectBoxLabelDash
          label={"Phân loại giá"}
          data={convertObjectToDataSelectBox(PRICE_CATEGORY)}
          key={"price category"}
          itemKey="priceCategory"
          defaultValue={dataSearch.priceCategory}
          placeholder={"Chọn phân loại giá vé"}
          callbackChangeValue={handleChange}
          require={requriePrice}
        />
        <TextFieldLabelDash
          label={"Địa điểm"}
          key={"locationName"}
          defaultValue={dataSearch.locationName}
          itemKey="locationName"
          placeholder={"Nhập tên địa điểm"}
          callbackChangeValue={handleChange}
        />
        <SelectBoxLabelDash
          label={"Phương tiện"}
          data={convertObjectToDataSelectBox(VEHICLE)}
          key={"vehicle"}
          itemKey="vehicle"
          defaultValue={dataSearch.vehicle}
          placeholder={"Chọn phương tiện"}
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
