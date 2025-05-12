import { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import "./style.css";
import CardNotify from "./CardNotify";
import WebSocket from "@/configs/websocket";

const Notifitation = () => {
  const [showNotify, setShowNotify] = useState(false);
  const [countNotify, setCountNotify] = useState(1);

  const handleToggleNotify = () => {
    setShowNotify((pre) => !pre);
  };

  useEffect(() => {
    const callback = (data) => {
      console.log(data)
    }
    WebSocket.subscribe("/user/queue/notify", callback)
  }, []);

  return (
    <div style={{ paddingLeft: 60 }}>
      <div style={{ position: "relative" }}>
        {countNotify === 0 ? (
          <MdNotifications
            style={{ fontSize: 25, marginTop: 8 }}
            onClick={handleToggleNotify}
          />
        ) : (
          <>
            <MdNotificationsActive
              style={{ fontSize: 25, marginTop: 8 }}
              onClick={handleToggleNotify}
            />
            <div className="count-notity">{countNotify}</div>
          </>
        )}
        <div style={!showNotify ? { display: "none" } : {}}>
          <CardNotify
            setCountNotify={setCountNotify}
            onClose={() => setShowNotify(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifitation;
