import zalo from "@image/zalo.webp";
import "./style.css";
import { GENDER } from "@/utils/constants";
import { Button, Drawer, Radio } from "antd";
import Status from "./Status";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import ShowBoxEdit from "./ShowBoxEdit";
import dayj from "dayjs";

const InfoBox = ({ data }) => {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div style={{display: "flex" }}>
      <div style={{ width: 300 }}>
        <div>
          <h3>Thông tin tài khoản</h3>
          <div className="item">
            <span>Tên tài khoản: </span>
            <span>{data.fullName}</span>
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
            <span></span>
          </div>
        </div>
      </div>
      <div
        style={{
          borderLeft: "1px solid #5e5e5e",
          paddingLeft: 16,
          paddingBottom: 50,
          position: "relative",
        }}
      >
        <h3>Thông tin đối tác</h3>
        <div>
          <div className="item">
            <span>Người đại diện: </span>
            <span>{data.representativeFullName}</span>
          </div>
          <div className="item">
            <span>Số điện thoại: </span>
            <span>{data.partnerPhoneNumber}</span>
            <a
              href={`https://zalo.me/${data?.partnerPhoneNumber}`}
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
            <span>{data.partnerEmail}</span>
          </div>
          <div className="item">
            <span>Địa chỉ: </span>
            <span>{data.partnerAddress}</span>
          </div>
          <div className="item">
            <span>Hợp tác: </span>
            <span>{dayj(data.createdAt).format("DD/MM/YYYY")}</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 16 }}>
          <Button
            color="primary"
            variant="solid"
            onClick={() => {
              setShowEdit((pre) => !pre);
            }}
          >
            <FaEdit />
            Chỉnh sửa
          </Button>
        </div>
      </div>
      {showEdit && (
        <Drawer
          title="Chỉnh sửa thông tin đối tác"
          open={showEdit}
          onClose={() => {
            setShowEdit(false);
          }}
        >
          <ShowBoxEdit info={data}/>
        </Drawer>
      )}
    </div>
  );
};

export default InfoBox;
