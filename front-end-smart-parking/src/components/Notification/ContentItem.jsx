import { useCallback, useEffect, useState } from "react";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const ContentItem = ({ data, viewed }) => {
  const [time, setTime] = useState(null);
  const [timeInterval, setTimeInterval] = useState(10000);

  const convertTime = useCallback((ago) => {
    const d = dayjs.duration(ago, 'seconds');
    if (ago < 60) {
      setTime(ago + " giây");
    } else if (ago < 3600) {
      setTime(d.minutes() + " phút");
    } else if (ago < 3600 * 24) {
      setTime(d.hours() + " giờ");
      // tính lại sau mỗi phút
      setTimeInterval(360);
    } else {
      setTime(d.days() + " ngày");
      // tính lại sau mỗi giờ
      setTimeInterval(3600);
    }
  }, [])

  useEffect(() => {
    // tính thời gian thông báo
    const createdAt = dayjs(data.createdAt);
    const now = dayjs();
    let ago = Math.floor(now.diff(createdAt) / 1000);

    // cập nhật thời gian
    const idInterval = setInterval(() => {
      ago += timeInterval / 1000;
      convertTime(ago);
    }, timeInterval);

    // chạy lần đầu tiên
    convertTime(ago);
    return () => clearInterval(idInterval);
  }, [timeInterval, convertTime, data.createdAt]);
  return (
    <div className={!viewed ? "view-not-yet" : ""}>
      <div className="item-notify">
        <div style={{ fontSize: 16, height: 25 }}>{data.title}</div>
        <div style={{ fontSize: 13 }}>{data.content}</div>
        <div
          style={{
            fontSize: 12,
            color: "rgb(129, 128, 128)",
            textAlign: "right",
          }}
        >
          {time && time + " trước"}
        </div>
      </div>
    </div>
  )
}

export default ContentItem
