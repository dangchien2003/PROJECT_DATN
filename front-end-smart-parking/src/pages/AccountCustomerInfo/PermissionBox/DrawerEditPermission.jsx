import { Button, Drawer } from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import TreeTransfer from "./TreeTransfer";

const treeData = [
  {
    key: "Admin",
    title: "admin",
    disable: true,
  },
  {
    key: "0-1",
    title: "0-1",
    children: [
      {
        key: "0-1-0",
        title: "0-1-0",
      },
      {
        key: "0-1-1",
        title: "0-1-1",
      },
    ],
  },
  {
    key: "0-2",
    title: "0-2",
  },
  {
    key: "0-3",
    title: "0-3",
  },
  {
    key: "0-4",
    title: "0-4",
  },
];

const DrawerEditPermission = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [targetKeys, setTargetKeys] = useState([]);
  const onChange = (keys) => {
    setTargetKeys(keys);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log(targetKeys);
  };
  return (
    <div>
      <div style={{ padding: 16 }}>
        <Button
          color="primary"
          variant="solid"
          onClick={() => {
            setOpen((pre) => !pre);
          }}
        >
          <FaEdit />
          Chỉnh sửa
        </Button>
      </div>
      <Drawer title="Chỉnh sửa quyền tài khoản" onClose={onClose} open={open}>
        <TreeTransfer
          dataSource={treeData}
          targetKeys={targetKeys}
          onChange={onChange}
        />
        <Button
          color="cyan"
          variant="solid"
          onClick={handleSave}
          style={{ margin: 16 }}
        >
          Cập nhật
        </Button>
      </Drawer>
    </div>
  );
};
export default DrawerEditPermission;
