import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import NumberInputWithSortLabelDash from "@/components/NumberInputWithSortLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { setSearching } from "@/store/startSearchSlice";
import {
  PRICE_CATEGORY,
  TICKET_MODIFY_STATUS,
  VEHICLE_SELECTBOX,
} from "@/utils/constants";
import { isNullOrUndefined } from "@/utils/data";
import { changeInput, changeInputTrend } from "@/utils/handleChange";
import { convertObjectToDataSelectBox } from "@/utils/object";
import { Button } from "antd";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Search = ({ dataSearch }) => {
  const { pushMessage } = useMessageError();
    const { isSearching } = useSelector(state => state.startSearch)
    const [requriePrice, setRequirePrice] = useState(false);
    const dispatch = useDispatch();

  const handleChange = (key, value) => {
    changeInput(dataSearch, key, value);
    if (key === "priceCategory") {
      if (value !== undefined) {
        setRequirePrice(true);
      } else {
        setRequirePrice(false);
      }
    }
  };

  const handleChangeValueInputOrder = (key, value, trend, skip) => {
    changeInputTrend(dataSearch, key, value, trend, skip)
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
          key={"ticketName"}
          label="Tên vé"
          defaultValue={dataSearch.ticketName}
          placeholder={"Nhập tên vé"}
          itemKey="ticketName"
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"partner"}
          label="Đối tác"
          defaultValue={dataSearch.ticketName}
          placeholder={"Nhập id đối tác"}
          itemKey="partnerName"
          callbackChangeValue={handleChange}
        />
        <SelectBoxLabelDash
          label={"Trạng thái chỉnh sửa"}
          data={convertObjectToDataSelectBox(TICKET_MODIFY_STATUS)}
          key={"modify status"}
          itemKey="modifyStatus"
          placeholder={"Chọn trạng thái chỉnh sửa"}
          callbackChangeValue={handleChange}
          defaultValue={dataSearch.modifyStatus}
        />
        <DateTimePickerWithSortLabelDash
          label={"Thời gian phát hành"}
          itemKey={"releasedTime"}
          placeholder={"Chọn thời gian phát hành"}
          format="DD/MM/YYYY HH:mm"
          formatShowTime={{ format: "HH:mm" }}
          callbackChangeValue={handleChangeValueInputOrder}
          defaultValue={dataSearch.releasedTime}
        />
        <NumberInputWithSortLabelDash
          label={"Giá vé"}
          min={0}
          max={1000000000}
          itemKey={"priceSearch"}
          placeholder={"Nhập giá vé"}
          callbackChangeValue={handleChangeValueInputOrder}
          addonAfter="đ"
          defaultValue={dataSearch.priceSearch}
          trend={true}
        />
        <SelectBoxLabelDash
          label={"Phân loại giá"}
          data={convertObjectToDataSelectBox(PRICE_CATEGORY)}
          key={"priceCategory"}
          itemKey="priceCategory"
          placeholder={"Chọn phân loại giá vé"}
          callbackChangeValue={handleChange}
          require={dataSearch.priceSearch.price || dataSearch.priceCategory}
          defaultValue={dataSearch.priceCategory}
        />
        <TextFieldLabelDash
          label={"Địa điểm"}
          key={"locationName"}
          itemKey="locationName"
          placeholder={"Nhập tên địa điểm"}
          callbackChangeValue={handleChange}
          defaultValue={dataSearch.locationName}
        />
        <SelectBoxLabelDash
          label={"Phương tiện"}
          data={convertObjectToDataSelectBox(VEHICLE_SELECTBOX)}
          key={"vehicle"}
          itemKey="vehicle"
          placeholder={"Chọn phương tiện"}
          callbackChangeValue={handleChange}
          defaultValue={dataSearch.vehicle}
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
