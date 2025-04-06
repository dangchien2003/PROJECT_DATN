import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import { setSearching } from "@/store/startSearchSlice";
import { ACCOUNT_STATUS } from "@/utils/constants";
import { changeInput } from "@/utils/handleChange";
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
    changeInput(dataSearch, key, value);
  };

  const handleRunSearch = () => {
    console.log(dataSearch)
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
          itemKey={"partnerFullName"}
          label="Tên đối tác"
          defaultValue={""}
          placeholder={"Tên đối tác"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"email"}
          itemKey={"partnerEmail"}
          label="Địa chỉ email"
          defaultValue={""}
          placeholder={"Nhập địa chỉ email"}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          key={"sdt"}
          itemKey={"partnerPhoneNumber"}
          label="Số điện thoại"
          defaultValue={""}
          placeholder={"Nhập số điện thoại"}
          callbackChangeValue={handleChange}
          regex={/^\d{0,10}$/}
        />
        <SelectBoxLabelDash
          itemKey={"status"}
          key={"trang thai"}
          label={"Trạng thái"}
          data={ACCOUNT_STATUS}
          placeholder={"Chọn trạng thái"}
          callbackChangeValue={handleChange}
        />
        {/* <SelectBoxLabelDash
          label={"Vai trò"}
          data={ACCOUNT_STATUS}
          key={"vai tro"}
          placeholder={"Chọn vai trò"}
        /> */}
        {/* <SelectBoxLabelDash
          label={"Quyền truy cập"}
          data={ACCOUNT_STATUS}
          key={"quyen truy cap"}
          placeholder={"Chọn quyền truy cập"}
        /> */}
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
