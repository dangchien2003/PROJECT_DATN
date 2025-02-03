export function formatTimestamp(timestamp, format = "YYYY-MM-DD HH:mm:ss") {
  const date = new Date(timestamp);

  const pad = (num) => num.toString().padStart(2, "0");

  const replacements = {
    YYYY: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => replacements[match]);
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
