import dayjs from "dayjs";

export function formatTimestamp(timestamp, format = "DD/MM/YYYY HH:mm:ss", isTime = false) {
  if(!timestamp) {
    return null;
  }
  if(isTime) {
    return dayjs(`2025-01-01T${timestamp}`).format(format);
  }
  return dayjs(timestamp).format(format);
}

export function convertToTime(millis) {
  const totalSeconds = Math.floor(millis / 1000);
  const months = Math.floor(totalSeconds / (30 * 86400));
  const days = Math.floor((totalSeconds % (30 * 86400)) / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (months > 0) {
    if (days > 0) {
      return `${months} tháng ${days} ngày`;
    } else {
      return `${months} tháng`;
    }
  } else if (days > 0) {
    if (hours > 0) {
      return `${days} ngày ${hours} giờ`;
    } else {
      return `${days} ngày`;
    }
  } else if (hours > 0) {
    if (minutes > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else {
      return `${hours} giờ`;
    }
  } else if (minutes > 0) {
    if (seconds > 0) {
      return `${minutes} phút ${seconds} giây`;
    } else {
      return `${minutes} phút`;
    }
  } else {
    return `${seconds} giây`;
  }
}


export const getValueDate = (valueInput) => {
  // nếu ở dạng dayjs
  if(valueInput?.$L) {
    if(valueInput.$Y) {
      return valueInput;
    } else {
      return null;
    }
  }
  // kiểm tra dữ liệu dạng object
  if(valueInput) {
    // có sort
    if(valueInput.value !== undefined) {
      return valueInput.value ? dayjs(valueInput.value) : null;
    }else {
      // không sort
      return valueInput ? dayjs(valueInput) : null;
    }
  }
  return null;
}
