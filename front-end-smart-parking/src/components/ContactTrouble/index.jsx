import React from "react";
import { FaPhone } from "react-icons/fa6";
const ContactTrouble = () => {
  const phone = "0333757429";
  return (
    <a
      href={`https://zalo.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        marginRight: 24,
        lineHeight: "normal",
        color: "black",
      }}
    >
      <div style={{ lineHeight: "48px", marginTop: 8 }}>
        <FaPhone style={{ fontSize: 30 }} />
      </div>
      <div>
        <div>Liên hệ khi gặp sự cố</div>
        <div style={{ fontWeight: "bold", textAlign: "center" }}>{phone}</div>
      </div>
    </a>
  );
};

export default ContactTrouble;
