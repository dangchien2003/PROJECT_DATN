import React from "react";
import MenuAccount from "../MenuAccount";
import { getAccountFullName, getAvatar, getPartnerFullName } from "@/service/localStorageService";
import noAvatar from '@image/no_avatar2.png'

const Account = () => {
  const partnerName = getPartnerFullName();
  const accountName = getAccountFullName();
  const avatar = getAvatar();
  return (
    <div style={{ padding: "0 10px", display: "flex", paddingLeft: 48 }}>
      <MenuAccount
        linkAvatar={ avatar || noAvatar}
      />
      <div style={{ border: "1px solid black", margin: 5 }}></div>
      <div
        className="truncated-text"
        style={{ lineHeight: "50px", paddingLeft: 5, width: 130, fontSize: 18 }}
      >
        {partnerName || accountName}
      </div>
    </div>
  );
};

export default Account;
