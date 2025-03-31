import CheckboxWithDash from "@/components/CheckboxWithDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
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
        <DateTimePickerWithSortLabelDash
          label={"Thời gian yêu cầu"}
          itemKey={["request.time", "request.order"]}
          placeholder={"Chọn thời gian phát hành"}
          format="DD/MM/YYYY HH:mm"
          formatShowTime={{ format: "HH:mm" }}
          callbackChangeValue={handleChangeValueInputOrder}
        />
        <DateTimePickerWithSortLabelDash
          label={"Thời gian phát hành/Áp dụng"}
          itemKey={["releasedOrApplyTime.time", "releasedOrApplyTime.order"]}
          placeholder={"Chọn thời gian phát hành"}
          format="DD/MM/YYYY HH:mm"
          formatShowTime={{ format: "HH:mm" }}
          callbackChangeValue={handleChangeValueInputOrder}
        />
        {dataSearch.type !== 3 && <CheckboxWithDash label={"Duyệt khẩn cấp"} itemKey={"urgent"} callbackChangeValue={handleChange} value={dataSearch?.urgent}/>}
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
