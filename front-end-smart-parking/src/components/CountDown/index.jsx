import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

dayjs.extend(duration);

const CountDown = ({ start, end }) => {
  const [timeLeftMs, setTimeLeftMs] = useState(0);

  useEffect(() => {
    if (!start || !end) return;

    const startTime = dayjs(start);
    const endTime = dayjs(end);

    let diff = endTime.diff(startTime);

    setTimeLeftMs(diff);

    const id = setInterval(() => {
      diff -= 1000;

      if (diff <= 0) {
        clearInterval(id);
        setTimeLeftMs(0);
        return;
      } else {
        setTimeLeftMs(diff);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [start, end]);

  const d = dayjs.duration(timeLeftMs);
  const days = Math.floor(d.asDays());
  const hours = d.hours();
  const minutes = d.minutes();
  const seconds = d.seconds();
  return (
    <div>
      {(timeLeftMs > 0 && days > 0) && `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`}
      {(timeLeftMs > 0 && days === 0 && hours > 0) && `${hours} giờ ${minutes} phút ${seconds} giây`}
      {(timeLeftMs > 0 && hours === 0 && minutes > 0) && `${minutes} phút ${seconds} giây`}
      {(minutes <= 0) && `${seconds} giây`}
    </div>
  );
};

export default CountDown;
