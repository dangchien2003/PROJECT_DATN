import { useState } from "react";
import { Tooltip, Transfer } from "antd";
import { dataRoles, target } from "./dataTest";
import "./style.css";
import DrawerEditPermission from "./DrawerEditPermission";
const renderTooltip = (text, textTooltip) => {
  return (
    <Tooltip placement="topLeft" title={textTooltip ? textTooltip : text}>
      <span>{text}</span>
    </Tooltip>
  );
};
const PermissionBox = () => {
  const [targetKeys, setTargetKeys] = useState(target);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    console.log("targetKeys:", nextTargetKeys);
    console.log("direction:", direction);
    console.log("moveKeys:", moveKeys);
    setTargetKeys(nextTargetKeys);
  };
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log("sourceSelectedKeys:", sourceSelectedKeys);
    console.log("targetSelectedKeys:", targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  const onScroll = (direction, e) => {
    console.log("direction:", direction);
    console.log("target:", e.target);
  };

  return (
    <div
      style={{ borderLeft: "1px solid #B9B7B7", paddingLeft: 16, width: 500 }}
    >
      <div>
        <Transfer
          className="view-show"
          disabled
          dataSource={dataRoles}
          titles={[
            renderTooltip("Không có quyền"),
            renderTooltip("Quyền hiện tại"),
          ]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          onScroll={onScroll}
          render={(item) => item.title}
        />
      </div>
      <DrawerEditPermission />
    </div>
  );
};
export default PermissionBox;
