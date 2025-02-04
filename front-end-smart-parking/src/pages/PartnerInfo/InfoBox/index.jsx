import zalo from "@image/zalo.webp";
import "./style.css";
import { GENDER } from "@/utils/constants";
import { Radio } from "antd";
import Status from "./Status";
const InfoBox = ({ data }) => {
  return (
    <div style={{ width: 650, display: "flex" }}>
      <div style={{ width: 300 }}>
        <div>
          <h3>Thông tin tài khoản</h3>
          <div className="item">
            <span>Tên tài khoản: </span>
            <span>Lê đăng chiến</span>
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
        </div>
      </div>
      <div style={{ borderLeft: "1px solid #5e5e5e", paddingLeft: 16 }}>
        <h3>Thông tin đối tác</h3>
        <div>
          <div className="item">
            <span>Người đại diện: </span>
            <span>Lê Văn A</span>
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
            <span>Email: </span>
            <span>dangchien@gmail.com</span>
          </div>
          <div className="item">
            <span>Địa chỉ: </span>
            <span>Cầu Diễn, Bắc Từ Liêm, Hà Nội</span>
          </div>
          <div className="item">
            <span>Hợp tác: </span>
            <span>11/11/2003</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
