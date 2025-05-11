import { checkNotifyViewd } from "@/utils/notify";
import React, { useEffect, useState } from "react";
const ItemNotify = ({ data, setCountNotify }) => {
  const [viewed, setViewed] = useState(checkNotifyViewd(data.viewed));

  const handleViewed = () => {
    setViewed(1);
    if (!viewed) {
      setCountNotify((pre) => --pre);
    }
  };

  useEffect(() => {
    setViewed(checkNotifyViewd(data.viewed));
  }, [data.viewed]);
  return (
    <div //Link
      to={data.link}
      style={{ color: "black" }}
      onClick={!viewed ? handleViewed : null}
    >
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
            1 giờ trước
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemNotify;
