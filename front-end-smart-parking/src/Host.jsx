import { Button, Drawer } from "antd";
import React, { useState } from "react";
import { CiPen } from "react-icons/ci";
import TextFieldLabelDash from "./components/TextFieldLabelDash";
import httpClient from "./configs/axiosConfig";
import { getApiHost, saveApiHost } from "./configs/apiConfig";

const Host = () => {
  const [open, setOpen] = useState(true);
  const [host, setHost] = useState(getApiHost());
  const onClose = () => {
    setOpen(false);
  };

  const onSave = () => {
    let hostNew = host;
    if (host.endsWith("/api")) {
      hostNew = host + "/";
    } else if (!host.endsWith("/api/")) {
      hostNew = host + "/api/";
    }
    saveApiHost(hostNew);
    httpClient.defaults.baseURL = hostNew;
  };
  return (
    <div>
      <span style={{ position: "fixed" }} onClick={() => setOpen(true)}>
        <CiPen />
      </span>
      <Drawer
        title="Cài đặt host"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
      >
        <TextFieldLabelDash
          label={"Tên miền"}
          defaultValue={host}
          callbackChangeValue={(key, value) => {
            setHost(value);
          }}
        />
        <div>
          <Button
            color="green"
            variant="outlined"
            onClick={() => setHost("http://localhost:8080")}
          >
            http://localhost:8080
          </Button>
        </div>
        <div style={{ padding: 10 }}>
          <Button color="primary" variant="solid" onClick={onSave}>
            Lưu
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Host;
