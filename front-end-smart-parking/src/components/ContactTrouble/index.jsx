import React from "react";
import { FaPhone } from "react-icons/fa6";

const ContactTrouble = () => {
  return (
    <div
      style={{
        display: "flex",
        marginRight: 24,
        lineHeight: "normal",
      }}
    >
      <div style={{ lineHeight: "48px", marginTop: 8 }}>
        <FaPhone style={{ fontSize: 30 }} />
      </div>
      <div>
        <div>Liên hệ khi gặp sự cố</div>
        <div style={{ fontWeight: "bold", textAlign: "center" }}>
          0123456789
        </div>
      </div>
    </div>
  );
};

export default ContactTrouble;
