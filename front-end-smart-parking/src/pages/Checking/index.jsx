import httpClient from "@/configs/axiosConfig";
import { getDataApi } from "@/utils/api";
import { toastError, toastSuccess } from "@/utils/toast";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Radio,
  Row,
  Tabs,
  Upload
} from "antd";
import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";

const { TabPane } = Tabs;

export default function Checking() {
  const [contentQr, setContentQr] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [method, setMethod] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [plateImageIn, setPlateImageIn] = useState(null);
  const [plateImageOut, setPlateImageOut] = useState(null);
  const [palateIn, setPlateIn] = useState(null);
  const [locatonId, setLocationId] = useState(null);

  const pasteAreaRef = useRef(null);

  // Lắng nghe sự kiện paste ảnh QR
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (const item of items) {
          if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.src = event.target.result;
              img.onload = () => {
                // Convert ảnh thành ImageData để decode QR
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                  setContentQr(code.data);
                  // toastSuccess(`Đã giải mã QR: ${code.data}`);
                } else {
                  toastError("Không giải mã được QR");
                }

                setQrImage(event.target.result);
              };
            };
            reader.readAsDataURL(file);
            e.preventDefault();
            break;
          }
        }
      }
    };
    const pasteArea = pasteAreaRef.current;
    pasteArea.addEventListener("paste", handlePaste);

    return () => {
      pasteArea.removeEventListener("paste", handlePaste);
    };
  }, []);

  const uploadPropsIn = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPlateImageIn(event.target.result);
      };
      reader.readAsDataURL(file);
      return false; // Không upload thật
    },
  };

  const uploadPropsOut = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPlateImageOut(event.target.result);
      };
      reader.readAsDataURL(file);
      return false;
    },
  };

  const dataURLtoFile = async (dataUrl, filename = "plate_in.png") => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/png" });
  };

  const handleSubmitIn = async () => {
    setPlateIn(null);
    setPlateImageOut(null);
    if (!plateImageIn) {
      toastError("Vui lòng chọn ảnh biển số");
      return;
    }

    // Lấy content
    const content = method === "1" ? cardNumber : contentQr;
    if (!content) {
      toastError("Chưa có nội dung (QR hoặc số thẻ) để gửi");
      return;
    }

    // Chuyển DataURL sang File
    const pngFile = await dataURLtoFile(plateImageIn, "plate_in.png");

    // Tạo FormData
    const formData = new FormData();
    formData.append("file", pngFile);
    formData.append("method", method);
    formData.append("content", content);
    formData.append("locationId", locatonId);

    // Gửi bằng Axios
    httpClient.post("http://localhost:8080/api/parking/checking/checkin", formData, {
      skipAuth: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      toastSuccess("Check-in thành công");
    }).catch(err => {
      const response = getDataApi(err);
      toastError(response.message);
    })
  };

  const handleSubmitOut = async () => {
    setPlateImageIn(null);

    if (!plateImageOut) {
      toastError("Chưa có ảnh lúc ra");
      return;
    }
    const content = method === "1" ? cardNumber : contentQr;
    if (!content) {
      toastError("Chưa có nội dung (QR hoặc số thẻ) để gửi");
      return;
    }
    // Chuyển DataURL sang File
    const pngFile = await dataURLtoFile(plateImageOut, "plate_in.png");

    // Tạo FormData
    const formData = new FormData();
    formData.append("file", pngFile);
    formData.append("method", method);
    formData.append("content", content);
    formData.append("locationId", locatonId);
    // Gửi bằng Axios
    httpClient.post("http://localhost:8080/api/parking/checking/checkout", formData, {
      skipAuth: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      const result = getDataApi(response);
      setPlateIn(result)
      toastSuccess("Check-out thành công");
    }).catch(err => {
      const response = getDataApi(err);
      toastError(response.message);
    })
  };
  return (
    <Card title="Demo Check-in / Check-out Vé Xe" style={{ margin: 20 }}>
      <ToastContainer />
      <div
        ref={pasteAreaRef}
        style={{
          border: "1px dashed #ccc",
          padding: 10,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Dán ảnh mã QR vào đây
        {qrImage && (
          <div style={{ marginTop: 10 }}>
            <img src={qrImage} alt="QR" style={{ maxHeight: 100 }} />
          </div>
        )}
      </div>
      <Input
        placeholder="Nhập địa điểm"
        value={locatonId}
        onChange={(e) => setLocationId(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Radio.Group
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        <Radio value="0">QR</Radio>
        <Radio value="1">Thẻ</Radio>
      </Radio.Group>
      <Tabs defaultActiveKey="in">
        <TabPane tab="Vào" key="in">
          <Input
            placeholder="Nhập mã số thẻ"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            style={{ marginBottom: 10 }}
          />

          <Upload {...uploadPropsIn}>
            <Button icon={<UploadOutlined />}>Tải ảnh biển số vào</Button>
          </Upload>

          <Button
            type="primary"
            style={{ marginTop: 10 }}
            onClick={handleSubmitIn}
          >
            Gửi
          </Button>

          {plateImageIn && (
            <div style={{ marginTop: 20 }}>
              <h4>Ảnh biển số đã lưu lúc vào:</h4>
              <img src={plateImageIn} alt="Biển số vào" style={{ maxWidth: "100%" }} />
            </div>
          )}
        </TabPane>

        <TabPane tab="Ra" key="out">
          <Input
            placeholder="Nhập mã số thẻ"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            style={{ marginBottom: 10 }}
          />

          <Upload {...uploadPropsOut}>
            <Button icon={<UploadOutlined />}>Tải ảnh biển số ra</Button>
          </Upload>

          <Button
            type="primary"
            style={{ marginTop: 10 }}
            onClick={handleSubmitOut}
          >
            Gửi
          </Button>

          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={12}>
              <h4>Ảnh lúc ra:</h4>
              {plateImageOut ? (
                <img src={plateImageOut} alt="Biển số ra" style={{ maxWidth: "100%" }} />
              ) : (
                <p>Chưa chọn ảnh lúc ra</p>
              )}
            </Col>
            <Col span={12}>
              <h4>Ảnh lúc vào:</h4>
              {palateIn ? (
                <img src={palateIn} alt="Biển số vào" style={{ maxWidth: "100%" }} />
              ) : (
                <p>Chưa lưu ảnh lúc vào</p>
              )}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
  );
}
