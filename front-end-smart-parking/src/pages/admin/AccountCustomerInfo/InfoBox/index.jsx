import zalo from "@image/zalo.webp";
import "./style.css";
import { ACCOUNT_CATEGORY_NAME, GENDER } from "@/utils/constants";
import { Radio } from "antd";
import Status from "./Status";
import { formatCurrency } from "@/utils/number";
const InfoBox = ({ data }) => {
  return (
    <div style={{ width: 500 }}>
      <div>
        <div className="item">
          <span>Loại tài khoản: </span>
          <span>{data.category && ACCOUNT_CATEGORY_NAME.filter(item => item.code === data.category)[0].value}</span>
        </div>
        <div className="item">
          <span>Giới tính: </span>
          <span style={{ cursor: "not-allowed" }}>
            <Radio.Group
              name="gender"
              options={GENDER.map((item) => ({
                ...item,
              }))}
              value={data.gender}
            />
          </span>
        </div>
        <div className="item">
          <span>Email: </span>
          <span>{data.email}</span>
        </div>
        <div className="item">
          <span>Số điện thoại: </span>
          <span>{data.phoneNumber}</span>
          <a
            href={`https://zalo.me/${data?.phoneNumber}`}
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
          <Status info={{ id: data.id, status: data.status, fullName: data.fullName }} />
        </div>
        <div className="item">
          <span>Lý do: </span>
          <span>{data.reason}</span>
        </div>
        <div className="item">
          <span>Số dư tài khoản: </span>
          <span style={{ fontWeight: "bold" }}>{formatCurrency(data.balance)} đ</span>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
