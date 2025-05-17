import { useEffect, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import LineLoading from "../Loading/LineLoading";

const FullPageLoading = () => {
  const [dot, setDot] = useState(".");
  const isLoading = useSelector((state) => state.loading.isLoading);
  const title = useSelector((state) => state.loading.title);
  const type = useSelector((state) => state.loading.type);

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
      {type === 1 ? <>
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
          {title ? title : "Đang tải dữ liệu"}{dot}
        </div>
      </> 
      : <>
        <LineLoading/>
      </>}
    </div>
  );
};

export default FullPageLoading;
