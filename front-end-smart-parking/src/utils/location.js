import { FaCircleDot } from "react-icons/fa6";

export const getUsedStatus = (capacity, used) => {
  var tiLe = Math.floor((used / capacity) * 100);
  if (tiLe <= 30) {
    return <div><FaCircleDot className='status level1' />Thưa thớt</div>
  } else if (tiLe <= 50) {
    return <div><FaCircleDot className='status level2' />Khá thưa thớt</div>
  } else if (tiLe <= 70) {
    return <div><FaCircleDot className='status level3' />Nhộn nhịp</div>
  } else if (tiLe <= 90) {
    return <div><FaCircleDot className='status level4' />Đông đúc</div>
  } else if (tiLe < 100) {
    return <div><FaCircleDot className='status level5' />Rất đông đúc</div>
  } else {
    return <div><FaCircleDot className='status level6' />Hết chỗ</div>
  }
}

export const geTimeAction = (openTime, closeTime, openHoliday) => {
  var result = null
  if (openTime === closeTime) {
    if (openHoliday) {
      result = "Hoạt động 24/7";
    } else {
      result = "Hoạt động 24 giờ - không làm việc ngày lễ";
    }
  } else if (openTime !== closeTime) {
    const open = openTime.split(':');
    const close = closeTime.split(':');
    result = `Hoạt động từ ${open[0]} giờ ${open[1]} phút đến ${close[0]} giờ ${close[1]} phút`;
    if (!openHoliday) {
      result += " - không làm việc ngày lễ";
    }
  }
  return result;
}