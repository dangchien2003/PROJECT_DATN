import DividerCustom from "@/components/DividerCustom";
import Account from "./Account";
import { useState } from "react";
import { Button, Checkbox } from "antd";
import Partner from "./Partner";

const CreateAccount = () => {
  const [showBoxPartner, setShowBoxPartner] = useState(false);
  return (
    <div>
      <Account />
      <div>
        <Checkbox
          onChange={() => {
            setShowBoxPartner((pre) => !pre);
          }}
        >
          Tạo cho đối tác
        </Checkbox>
      </div>
      {showBoxPartner && <DividerCustom />}
      <div style={!showBoxPartner ? { display: "none" } : {}}>
        <Partner />
      </div>
      {/* nút */}
      <div style={{ textAlign: "right" }}>
        <Button color="cyan" variant="solid">
          Tạo
        </Button>
      </div>
    </div>
  );
};

export default CreateAccount;
