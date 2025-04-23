import dayjs from 'dayjs';

export function dateTimeAffterNow(value, unit, current, format) {
  const allowUnit = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'y', 'M', 'w', 'd', 'h', 'm', 's', 'ms'];
  if (allowUnit.includes(unit) === false) {
    throw new Error('Đơn vị so sánh không hợp lệ')
  }
  let currentDate = null;
  if (format) {
    currentDate = dayjs(current, format);
  } else {
    currentDate = dayjs(current)
  }
  const compareDate = dayjs().add(value, unit);
  return currentDate.isAfter(compareDate) || currentDate.isSame(compareDate);
}