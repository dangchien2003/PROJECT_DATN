import zalo from "@image/zalo.webp";
import "./style.css";
import { GENDER } from "@/utils/constants";
import { Radio } from "antd";
import Status from "./Status";
const InfoBox = ({ data }) => {
  return (
    <div style={{ width: 500 }}>
      <div>
        <div className="item">
          <span>Loại tài khoản: </span>
          <span>Khách hàng</span>
        </div>
        <div className="item">
          <span>Giới tính: </span>
          <span style={{ cursor: "not-allowed" }}>
            <Radio.Group
              name="gender"
              options={GENDER.map((item) => ({
                ...item,
                disabled: item.value !== 1,
              }))}
              value={1}
            />
          </span>
        </div>
        <div className="item">
          <span>Email: </span>
          <span>dangchien@gmail.com</span>
        </div>
        <div className="item">
          <span>Số điện thoại: </span>
          <span>0333757429</span>
          <a
            href={`https://zalo.me/${data?.phone}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={zalo}
              alt="contact zalo"
              style={{ width: 20, height: 20, marginLeft: 8 }}
            />
          </a>
        </div>
        <div className="item">
          <span>Trạng thái: </span>
          <Status info={{ id: 1, status: 1, full_name: "le dang chien" }} />
        </div>
        <div className="item">
          <span>Lý do: </span>
          <span></span>
        </div>
        <div className="item">
          <span>Số dư tài khoản: </span>
          <span style={{ fontWeight: "bold" }}>100.000 đ</span>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
