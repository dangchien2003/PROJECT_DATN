import InputError from '@/components/InputError';
import ModalCustom from '@/components/ModalCustom';
import { useMessageError } from '@/hook/validate';
import { PRICE_CATEGORY } from '@/utils/constants';
import { setCookie } from '@/utils/cookie';
import { Button, DatePicker } from 'antd';
import { Select } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormBuyFor from './FormBuyFor';



const ChooseTime = ({ category, onChangeStartTime, location, ticket }) => {
  const [quality, setQuality] = React.useState(1);
  const [openBuyFor, setOpenBuyFor] = React.useState(false);
  const [dataQueryParam, setDataQueryParam] = React.useState({});
  const [valueSelectTime, setValueSelectTime] = React.useState([])
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [owner, setOwner] = React.useState([]);
  const [endTime, setEndTime] = React.useState(null);
  const { pushMessage, reset, deleteKey } = useMessageError();
  const navigate = useNavigate();

  useEffect(() => {
    setDataQueryParam({
      ticketId: ticket?.ticketId,
      ticketName: ticket?.name,
      locationId: location?.locationId,
      locationName: location?.name,
      address: location?.address,
      startTime: selectedTime?.format("DD/MM/YYYY HH:mm"), 
      endTime: endTime?.format("DD/MM/YYYY HH:mm")
    });
  }, [selectedTime, endTime, ticket, location, category])
  
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
      setEndTime(null);
    } else if(dayjsSelect.get("minute") % 15 > 0) {
      pushMessage("start-time", "Thời gian không hợp lệ");
      setEndTime(null);
    }  else {
      // cập nhật callback
      if(onChangeStartTime) {
        onChangeStartTime(value)
      }
      // xoá lỗi
      deleteKey("start-time");
      // tính thời gian hết hạn
      if(value) {
        setEndTime(dayjsSelect.add(quality, getCharTime()))
      } else {
        setEndTime(null);
      }
    }
  }

  const handlePayment = () => {
    if(validate()) {
      return;
    }

    dataQueryParam.owner = owner.map(item => {
      delete item.value;
      return item;
    })
    setCookie("order", JSON.stringify(dataQueryParam), 360);
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

  const handleChangeOwner= (data) => {
    setOwner(data);
    handleCloseBuyFor();
  }

  return (
    <div>
      <h2>Chọn thời hạn</h2>
      <div className='form'>
        <div className='mb12'>
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
            <div className="mb4">
              <span className='dib'>Đến:</span>
              <DatePicker
                value={endTime}
                format="DD/MM/YYYY HH:mm"
                showTime={{ defaultValue: dayjs('00:00', 'HH:mm') }}
                disabled={true}
                placeholder={`Sau ${quality} ${getCategoryName()}`}
                className='date-picker' />
            </div>
            {owner.length > 0 && <span>Mua hộ: <b>{owner.length}</b> người</span>}
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
        <FormBuyFor onOk={handleChangeOwner}/>
      </ModalCustom>}

    </div>
  )
}

export default ChooseTime
