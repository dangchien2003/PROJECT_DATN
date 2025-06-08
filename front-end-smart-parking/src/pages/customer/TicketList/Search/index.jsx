import { Button, Col, Row } from 'antd';
import './style.css'
import TextFieldLabelDash from '@/components/TextFieldLabelDash';
import { IoSearch } from 'react-icons/io5';
import DatePickerFromToLabelDash from '@/components/DatePickerFromToLabelDash';
import DatePickerLabelDash from '@/components/DatePickerLabelDash';
import { useMessageError } from '@/hook/validate';
import { useRequireField } from '@/hook/useRequireField';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSearching } from '@/store/startSearchSlice';
import { changeInput } from '@/utils/handleChange';

const Search = ({ dataSearch }) => {
  const { reset } = useMessageError();
  const { resetRequireField } = useRequireField();
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();

  useEffect(() => {
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
      <Row>
        <Col>
          <TextFieldLabelDash itemKey="locationName" label={"Tên địa điểm"} placeholder={"Điền tên địa điểm"} callbackChangeValue={handleChange} />
        </Col>
        <Col>
          <DatePickerFromToLabelDash itemKey="buyDate" label={"Ngày mua"} placeholder={"Chọn ngày mua"} callbackChangeValue={handleChange} />
        </Col>
        <Col>
          <DatePickerLabelDash 
            itemKey="useDate" 
            label={"Ngày sử dụng"} 
            placeholder={"Chọn ngày sử dụng"} 
            format={"DD/MM/YYYY"}
            callbackChangeValue={handleChange} 
          />
        </Col>
      </Row>
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