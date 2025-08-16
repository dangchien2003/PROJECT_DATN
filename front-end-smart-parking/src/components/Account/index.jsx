import React from "react";
import MenuAccount from "../MenuAccount";
import { getAccountFullName, getPartnerFullName } from "@/service/localStorageService";

const Account = () => {
  const partnerName = getPartnerFullName();
  const accountName = getAccountFullName();
  return (
    <div style={{ padding: "0 10px", display: "flex", paddingLeft: 48 }}>
      <MenuAccount
        linkAvatar={
          "https://imgcdn.stablediffusionweb.com/2024/3/24/17ee935b-c63a-4374-8fc3-91b2559e02f2.jpg"
        }
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
