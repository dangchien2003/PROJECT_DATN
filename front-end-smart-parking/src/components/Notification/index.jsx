import React from "react";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";

const Notifitation = () => {
  const count = 1;
  return (
    <div style={{ paddingLeft: 60 }}>
      {!count || count === 0 ? (
        <MdNotifications style={{ fontSize: 25 }} />
      ) : (
        <div style={{ position: "relative" }}>
          <MdNotificationsActive style={{ fontSize: 25 }} />
          <div
            style={{
              position: "absolute",
              width: 18,
              height: 18,
              borderRadius: "50%",
              top: "8px",
              right: "-8px",
              background: "#F0F0F0",
              border: "1px solid #E5E2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#E53333",
            }}
          >
            {count}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifitation;
