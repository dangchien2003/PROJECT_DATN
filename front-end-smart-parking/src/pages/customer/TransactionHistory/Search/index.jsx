import DatePickerFromToLabelDash from '@/components/DatePickerFromToLabelDash';
import './style.css'
import SelectBoxLabelDash from '@/components/SelectBoxLabelDash';
import { convertObjectToDataSelectBox } from '@/utils/object';
import { TYPE_TRANSACTION } from '@/utils/constants';
import { Button, Col, Flex, Row } from 'antd';
import { IoSearch } from 'react-icons/io5';

const type = convertObjectToDataSelectBox(TYPE_TRANSACTION)
const Search = () => {
  return (
    <div className='search-transaction'>
      <Row>
        <Col>
          <SelectBoxLabelDash data={type} label={"Giao dịch"} placeholder={"Chọn giao dịch"} />
        </Col>
        <Col>
          <DatePickerFromToLabelDash label={"Ngày giao dịch"} />
        </Col>
      </Row>
      <Flex justify='center'>
        <Button color="primary" variant="outlined">
          <IoSearch />
          Tìm kiếm
        </Button>
      </Flex>
    </div>
  );
};

export default Search;