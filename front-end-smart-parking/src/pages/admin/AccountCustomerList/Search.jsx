import NumberInputWithSortLabelDash from "@/components/NumberInputWithSortLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import { setSearching } from "@/store/startSearchSlice";
import { ACCOUNT_STATUS, GENDER } from "@/utils/constants";
import { changeInput, changeInputTrend } from "@/utils/handleChange";
import { Button } from "antd";
import { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Search = ({dataSearch}) => {
  const {resetRequireField} = useRequireField()
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  
  useEffect(()=> {
    resetRequireField()
  }, [resetRequireField])

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
          itemKey={"fullName"}
          key={"name"}
          label="Tên người dùng"
          defaultValue={dataSearch.fullName}
          placeholder={"Nhập tên người dùng"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          itemKey={"email"}
          key={"email"}
          label="Địa chỉ email"
          defaultValue={dataSearch.email}
          placeholder={"Nhập địa chỉ email"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          itemKey={"phoneNumber"}
          key={"sdt"}
          label="Số điện thoại"
          defaultValue={dataSearch.phoneNumber}
          placeholder={"Nhập số điện thoại"}
          callbackChangeValue={handleChange}
          regex={/^\d*$/}
          maxLength={10}
        />
        <SelectBoxLabelDash
          itemKey={"gender"}
          label={"Giới tính"}
          data={GENDER}
          key={"gioi tinh"}
          placeholder={"Chọn giới tính"}
          defaultValue={dataSearch.gender}
          callbackChangeValue={handleChange}
        />
        <SelectBoxLabelDash
          itemKey={"status"}
          label={"Trạng thái tài khoản"}
          data={ACCOUNT_STATUS}
          key={"trang thai"}
          placeholder={"Chọn trạng thái"}
          defaultValue={dataSearch.status}
          callbackChangeValue={handleChange}
        />
        <NumberInputWithSortLabelDash
          itemKey={"balance"}
          label={"Số dư tài khoản"}
          min={-10}
          max={1000000000}
          placeholder={"Nhập số dư"}
          addonAfter={"vnđ"}
          defaultValue={dataSearch.balance}
          callbackChangeValue={callbackChangeInputTrend}
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
