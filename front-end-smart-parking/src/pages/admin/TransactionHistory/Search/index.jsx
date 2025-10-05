import DatePickerFromToLabelDash from '@/components/DatePickerFromToLabelDash';
import SelectBoxLabelDash from '@/components/SelectBoxLabelDash';
import { setSearching } from '@/store/startSearchSlice';
import { TYPE_TRANSACTION } from '@/utils/constants';
import { changeInput } from '@/utils/handleChange';
import { convertObjectToDataSelectBox } from '@/utils/object';
import { Button, Col, Flex, Row } from 'antd';
import { IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';

const type = convertObjectToDataSelectBox(TYPE_TRANSACTION)
const Search = ({dataSearch}) => {
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();

  const handleChange = (key, value) => {
    changeInput(dataSearch, key, value)
  };

  const handleRunSearch = () => {
    if (!isSearching) {
      dispatch(setSearching(true))
    }
  };

  return (
    <div className='search-transaction'>
      <Row>
        <Col>
          <SelectBoxLabelDash itemKey={"type"} data={type} label={"Giao dịch"} placeholder={"Chọn giao dịch"}
            callbackChangeValue={handleChange} />
        </Col>
        <Col>
          <DatePickerFromToLabelDash itemKey={"transactionDate"} label={"Ngày giao dịch"} callbackChangeValue={handleChange}/>
        </Col>
      </Row>
      <Flex justify='center'>
        <Button color="primary" variant="outlined" onClick={handleRunSearch}>
          <IoSearch />
          Tìm kiếm
        </Button>
      </Flex>
    </div>
  );
};

export default Search;