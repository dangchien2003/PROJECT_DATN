import { useEffect, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const FullPageLoading = () => {
  const [dot, setDot] = useState(".");
  const isLoading = useSelector((state) => state.loading.isLoading);

  useEffect(() => {
    const interval = setInterval(() => {
      setDot((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        flexDirection: "column", // Căn dọc
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Màu nền mờ nhẹ
        zIndex: 9999,
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 48,
            }}
            spin
          />
        }
      />
      <div
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: "bold",
          color: "#1890ff", // Đồng màu với icon
        }}
      >
        Đang tải dữ liệu{dot}
      </div>
    </div>
  );
};

export default FullPageLoading;
