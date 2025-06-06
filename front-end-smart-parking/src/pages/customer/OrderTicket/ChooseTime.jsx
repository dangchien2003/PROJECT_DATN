import { PRICE_CATEGORY } from '@/utils/constants';
import { Button, DatePicker } from 'antd';
import { Select } from 'antd/lib';
import React from 'react'
import dayjs from 'dayjs';
import ModalCustom from '@/components/ModalCustom';
import FormBuyFor from './FormBuyFor';
import InputError from '@/components/InputError';
import { useMessageError } from '@/hook/validate';
import { useNavigate } from 'react-router-dom';



const ChooseTime = ({ category, onChangeStartTime }) => {
  const [quality, setQuality] = React.useState(1);
  const [openBuyFor, setOpenBuyFor] = React.useState(false);
  const [valueSelectTime, setValueSelectTime] = React.useState([])
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const { pushMessage, reset, deleteKey } = useMessageError();
  const navigate = useNavigate();
  
  const getCategoryName = () => {
    if (category === PRICE_CATEGORY.TIME.value) {
      return "giờ";
    } else if (category === PRICE_CATEGORY.DAY.value) {
      return "ngày";
    } else if (category === PRICE_CATEGORY.WEEK.value) {
      return "tuần";
    } else if (category === PRICE_CATEGORY.MONTH.value) {
      return "tháng";
    }
    return null;
  }

  const getCharTime = () => {
    if (category === PRICE_CATEGORY.TIME.value) {
      return "hour";
    } else if (category === PRICE_CATEGORY.DAY.value) {
      return "day";
    } else if (category === PRICE_CATEGORY.WEEK.value) {
      return "week";
    } else if (category === PRICE_CATEGORY.MONTH.value) {
      return "month";
    }
    return null;
  }

  React.useEffect(()=> {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  React.useEffect(() => {
    let end = null;
    const categoryName = getCategoryName();
    if (category === PRICE_CATEGORY.TIME.value) {
      end = 24;
    } else if (category === PRICE_CATEGORY.DAY.value) {
      end = 7;
    } else if (category === PRICE_CATEGORY.WEEK.value) {
      end = 4;
    } else if (category === PRICE_CATEGORY.MONTH.value) {
      end = 1;
    }
    const dataSelectBox = [];
    for (let i = 1; i <= end; i++) {
      dataSelectBox.push({
        label: i + " " + categoryName,
        value: i,
      })
    }
    setValueSelectTime(dataSelectBox);
    setQuality(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [category])

  React.useEffect(() => {
    handleChangeStartTime(selectedTime)
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [quality])

  const handleChangeTimeUse = (value) => {
    setQuality(value);
  }
  

  const handleOpenBuyFor = () => {
    setOpenBuyFor(true);
  }

  const handleCloseBuyFor = () => {
    setOpenBuyFor(false);
  }

  const handleChangeStartTime = (value) => {
    setSelectedTime(value)
    const dayjsSelect = dayjs(value);
    if (dayjsSelect.isBefore(dayjs())) {
      pushMessage("start-time", "Thời bắt đầu phải lớn hơn hiện tại");
      setEndDate(null);
    } else if(dayjsSelect.get("minute") % 15 > 0) {
      pushMessage("start-time", "Thời gian không hợp lệ");
      setEndDate(null);
    }  else {
      // cập nhật callback
      if(onChangeStartTime) {
        onChangeStartTime(value)
      }
      // xoá lỗi
      deleteKey("start-time");
      // tính thời gian hết hạn
      if(value) {
        setEndDate(dayjsSelect.add(quality, getCharTime()))
      } else {
        setEndDate(null);
      }
    }
  }

  const handlePayment = () => {
    if(validate()) {
      return;
    }
    navigate("/order/confirm");
  }

  const validate = () => {
    var error = false;
    var message = null;
    if(!selectedTime) {
      message = "Vui lòng điền thông tin để tiếp tục";
      error = true;
    }
    const timeSelect = dayjs(selectedTime);
    if(timeSelect.isBefore(dayjs())) {
      message = "Vui lòng điền thông tin để tiếp tục";
      error = true;
    }

    if(error) {
      pushMessage("start-time", message);
    } 

    return error;
  }

  return (
    <div>
      <h2>Chọn thời hạn</h2>
      <div className='form'>
        <div>
          <span className='mb4 dib'>Số {getCategoryName()} sử dụng:</span>
          <Select
            className='select-time'
            showSearch
            placeholder="--Chọn--"
            onChange={handleChangeTimeUse}
            value={quality}
            options={valueSelectTime}
            disabled={category === PRICE_CATEGORY.MONTH.value}
          />
        </div>
        <div>
          <div className='expire'>
            <div>
              <span className='mb4 dib'>Thời hạn từ:</span>
              <DatePicker
                format="DD/MM/YYYY HH:mm"
                showTime={{ defaultValue: dayjs('00:00', 'HH:mm'), minuteStep: 15, }}
                placeholder='DD/MM/YYYY HH:mm'
                minDate={dayjs()}
                maxDate={dayjs().add(1, 'month')}
                onChange={handleChangeStartTime}
                className='date-picker' />
              <InputError itemKey={"start-time"} />
            </div>
            <div>
              <span className='mb4 dib'>Đến:</span>
              <DatePicker
                value={endDate}
                format="DD/MM/YYYY HH:mm"
                showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                disabled={true}
                placeholder={`Sau ${quality} ${getCategoryName()}`}
                className='date-picker' />
            </div>
          </div>
        </div>
        <div className='action'>
          <Button color="primary" variant="solid" onClick={handleOpenBuyFor}>
            Mua hộ
          </Button>
          <Button color="danger" variant="solid" className='payment' onClick={handlePayment}>Thanh toán</Button>
        </div>
      </div>
      {openBuyFor && <ModalCustom onClose={handleCloseBuyFor}>
        <FormBuyFor />
      </ModalCustom>}

    </div>
  )
}

export default ChooseTime
