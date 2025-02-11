import CheckboxWithDash from "@/components/CheckboxWithDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import MultiSelectBoxLabelDash from "@/components/MultiSelectBoxLabelDash";
import NumberInputWithSortLabelDash from "@/components/NumberInputWithSortLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import {
  GENDER,
  PRICE_CATEGORY,
  VEHICLE_SELECTBOX,
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
  const handleChangeValueInputOrder = (value, order, key) => {
    if (typeof key === "object" && key.length === 2) {
      updateObjectValue(dataSearch, key[0], value);
      updateObjectValue(dataSearch, key[1], order);
    } else {
      updateObjectValue(dataSearch, value, key);
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
          label="Tên vé"
          defaultValue={""}
          placeholder={"Nhập tên vé"}
          itemKey="ticketName"
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"partner"}
          label="Đối tác"
          defaultValue={""}
          placeholder={"Nhập id đối tác"}
          itemKey="partnerId"
          callbackChangeValue={handleChange}
        />
        <DateTimePickerWithSortLabelDash
          label={"Thời gian phát hành/Áp dụng"}
          itemKey={["releasedOrApplyTime.time", "releasedOrApplyTime.order"]}
          placeholder={"Chọn thời gian phát hành"}
          format="DD/MM/YYYY HH:mm"
          formatShowTime={{ format: "HH:mm" }}
          callbackChangeValue={handleChangeValueInputOrder}
        />
        <NumberInputWithSortLabelDash
          label={"Giá vé"}
          min={-10}
          max={1000000000}
          itemKey={["priceSearch.price", "priceSearch.order"]}
          placeholder={"Nhập giá vé"}
          callbackChangeValue={handleChangeValueInputOrder}
          addonAfter="đ"
        />
        <SelectBoxLabelDash
          label={"Phân loại giá"}
          data={PRICE_CATEGORY}
          key={"price category"}
          itemKey="priceCategory"
          placeholder={"Chọn phân loại giá vé"}
          callbackChangeValue={handleChange}
        />
        <SelectBoxLabelDash
          label={"Địa điểm"}
          data={GENDER}
          key={"location"}
          itemKey="location"
          placeholder={"Chọn địa điểm"}
          callbackChangeValue={handleChange}
        />
        <MultiSelectBoxLabelDash
          label={"Phương tiện"}
          data={VEHICLE_SELECTBOX}
          key={"vehicle"}
          itemKey="vehicle"
          placeholder={"Chọn phương tiện"}
          callbackChangeValue={handleChange}
        />
        <CheckboxWithDash label={"Duyệt khẩn cấp"} itemKey={"urgent"} callbackChangeValue={handleChange} value={dataSearch?.urgent}/>
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
