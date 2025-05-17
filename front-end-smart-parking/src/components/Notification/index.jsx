import { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import "./style.css";
import CardNotify from "./CardNotify";
import { countNotify } from "@/service/notifyService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";

const Notifitation = () => {
  const [showNotify, setShowNotify] = useState(false);
  const [notifyCount, setNotifyCount] = useState(0);

  const handleToggleNotify = () => {
    setShowNotify((pre) => !pre);
  };

  // lấy sẵn thông báo
  useEffect(() => {
    // count
    countNotify().then(response => {
      let data = getDataApi(response);
      if (data > 99) {
        data = "99+";
      }
      setNotifyCount(data);
    })
    .catch((error) => {
      const errorMessage = getDataApi(error);
      toastError(errorMessage.message);
    })
    .finally(()=> {
      
    })
  }, []);

  return (
    <div style={{ paddingLeft: 60 }} className="notification">
      <div style={{ position: "relative" }}>
        {notifyCount === 0 ? (
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
            <div className="count-notity">{notifyCount}</div>
          </>
        )}
        <div style={!showNotify ? { display: "none" } : {}}>
          <CardNotify
            setCountNotify={setNotifyCount}
            onClose={() => setShowNotify(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifitation;
