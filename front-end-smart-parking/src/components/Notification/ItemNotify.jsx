import { Link } from "react-router-dom";
import { checkNotifyViewd } from "@/utils/notify";
import { useEffect, useState } from "react";
import WebSocket from "@/configs/websocket";
import ContentItem from "./ContentItem";
import { isNullOrUndefined } from "@/utils/data";

const ItemNotify = ({ data, setCountNotify }) => {
  const [viewed, setViewed] = useState(checkNotifyViewd(data.viewed));

  const handleViewed = () => {
    setViewed(1);
    if (!viewed) {
      setCountNotify((pre) => --pre);
    }
    // gọi socket thông báo đã xem
    WebSocket.send("/app/notify/viewed", data.id);
  };

  useEffect(() => {
    // check viewed
    setViewed(checkNotifyViewd(data.viewed));
  }, [data.viewed]);

  return (
    <>
      {isNullOrUndefined(data.link) ? 
      // không có link
      <div
        style={{ color: "black" }}
        onClick={!viewed ? handleViewed : null}
      >
        <ContentItem viewed={viewed} data={data} />
      </div> 
      : 
      // không link
      <Link
        to={data.link}
        target="_blank" rel="noopener noreferrer"
        style={{ color: "black" }}
        onClick={!viewed ? handleViewed : null}
      >
        <ContentItem viewed={viewed} data={data} />
      </Link>
      }
    </>
  );
};

export default ItemNotify;
