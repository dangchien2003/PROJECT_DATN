import InputError from "@/components/InputError";
import { useMessageError } from "@/hook/validate";
import { setCookie } from "@/utils/cookie";
import { Button, DatePicker, Flex } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepOrder from "../../OrderTicket/StepOrder";
const Extend = ({ ticket }) => {
  const navigate = useNavigate();
  const [expireSelect, setExpireSelect] = useState(null);
  const [timeStr, setTimeStr] = useState(null);
  const { pushMessage, reset, deleteKey } = useMessageError();
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handlePayment = () => {
    if (validate()) {
      return;
    }
    const extendInfo = {
      ticketId: ticket.id,
      expires: dayjs(expireSelect).format("YYYY-MM-DDTHH:mm:ss"),
      startTime: ticket.startsValidity,
      timeStr: timeStr
    }
    setCookie("extend", JSON.stringify(extendInfo), 360);
    navigate("/ticket/confirm-extend");
  }

  const validate = () => {
    var error = false;
    var message = null;
    if (!expireSelect) {
      message = "Vui lòng điền thông tin để tiếp tục";
      error = true;
    }
    const timeSelect = dayjs(expireSelect);
    if (timeSelect.isBefore(dayjs().add(30, 'minute'))) {
      message = "Thời gian phải sau hiện tại 30 phút";
      error = true;
    }
    if (error) {
      pushMessage("expire", message);
    }
    return error;
  }

  const handleChangeExpire = (value) => {
    setExpireSelect(value);
    const dayjsSelect = dayjs(value);
    if (dayjsSelect.isBefore(dayjs().add(30, 'minute'))) {
      pushMessage("expire", "Hạn sử dụng phải lớn hơn hiện tại 30 phút");
      setExpireSelect(null);
      setTimeStr(null);
    } else if (dayjsSelect.get("minute") % 15 > 0) {
      pushMessage("expire", "Thời gian không hợp lệ");
      setExpireSelect(null);
      setTimeStr(null);
    } else {
      // xoá lỗi
      deleteKey("expire");
      const startTime = dayjs(ticket.expires);
      const endTime = dayjs(value);
      let diff = endTime.diff(startTime);

      const d = dayjs.duration(diff);
      const days = Math.floor(d.asDays());
      const hours = d.hours();
      const minutes = d.minutes();
      let timeStr = null;
      if (days > 0) {
        timeStr = `${days} ngày ${hours} giờ ${minutes} phút`
      }
      else if (hours > 0) {
        timeStr = `${hours} giờ ${minutes} phút`
      } else if (minutes > 0) {
        timeStr = `${minutes} phút`
      } else {
        timeStr = "--"
      }
      setTimeStr(timeStr);
    }
  }

  return (
    <div className='Extend'>
      <StepOrder current={0} />
      <div className='detail-item'>
        <div className='label'>
          Hạn trước thay đổi:
        </div>
        <div>
          <b>
            <span>{dayjs(ticket?.startsValidity).format("HH:mm DD/MM/YYYY")}</span> <span> - </span>
            <span>{dayjs(ticket?.expires).format("HH:mm DD/MM/YYYY")}</span>
          </b>
        </div>
      </div>
      <div className='detail-item'>
        <div className='label'>
          Hạn sau thay đổi:
        </div>
        <div>
          <b>
            <span>{dayjs(ticket?.startsValidity).format("HH:mm DD/MM/YYYY")}</span>
            {expireSelect && <><span> - </span>
              <span>{dayjs(expireSelect).format("HH:mm DD/MM/YYYY")}</span></>}
          </b>
        </div>
      </div>
      <div className="detail-item" style={{ display: "block" }}>
        <DatePicker
          style={{ width: "100%" }}
          format="DD/MM/YYYY HH:mm"
          showTime={{ format: 'HH:mm', minuteStep: 15, }}
          placeholder='Chọn hạn sử dụng'
          minDate={dayjs().add(30, 'minute')}
          maxDate={dayjs().add(1, 'day')}
          onChange={handleChangeExpire}
        />
        <InputError itemKey={"expire"} />
      </div>
      <div className='detail-item'>
        <div className='label'>
          Chi phí thêm:
        </div>
        <div>
          <b>
            15.000đ/15 phút
          </b>
        </div>
      </div>
      <div className='detail-item'>
        <div className='label'>
          Thời gian thêm:
        </div>
        <div>
          <b>
            {timeStr}
          </b>
        </div>
      </div>
      <Flex justify="center">
        <Button color="primary" variant="solid" onClick={handlePayment}>Thanh toán</Button>
      </Flex>
    </div>
  );
};

export default Extend;