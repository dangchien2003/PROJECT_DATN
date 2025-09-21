import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { useLoading } from "@/hook/loading";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { changeInfoPartner } from "@/service/accountService";
import { getDataApi } from "@/utils/api";
import { updateObjectValue } from "@/utils/object";
import { toastError, toastSuccess } from "@/utils/toast";
import { Button } from "antd";
import { useEffect, useRef } from "react";

const ShowBoxEdit = ({ info }) => {
  const partner = useRef({...info})
  const { reset } = useMessageError();
  const { resetRequireField } = useRequireField();
  const { hideLoad, showLoad } = useLoading();
  useEffect(() => {
    reset();
    resetRequireField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (key, value) => {
    updateObjectValue(partner.current, key, value);
  }

  const onEdit = () => {
    showLoad();
    changeInfoPartner(partner.current).then(response => {
      toastSuccess("Thay đổi thông tin thành công");
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(hideLoad)
  }
  return (
    <div>
      <div>
        <h4 style={{ paddingBottom: 8 }}>Thông tin Đối tác</h4>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <TextFieldLabelDash
            label={"Tên đối tác"}
            placeholder={"Nhập tên đối tác"}
            key={"ten dt"}
            itemKey={"partnerFullName"}
            defaultValue={info.partnerFullName}
            callbackChangeValue={handleChange}
          />
          <TextFieldLabelDash
            label={"Người đại diện"}
            placeholder={"Nhập người đại diện"}
            itemKey={"representativeFullName"}
            key={"nguoi dd"}
            defaultValue={info.representativeFullName}
            callbackChangeValue={handleChange}
          />
          <TextFieldLabelDash
            label={"Email liên hệ"}
            placeholder={"Nhập địa chỉ email"}
            itemKey={"partnerEmail"}
            key={"email"}
            defaultValue={info.partnerEmail}
            callbackChangeValue={handleChange}
          />
          <TextFieldLabelDash
            key={"sdt"}
            itemKey={"partnerPhoneNumber"}
            label="Số điện thoại"
            placeholder={"Nhập số điện thoại"}
            callbackChangeValue={handleChange}
            regex={/^\d{0,9}$/}
            prefix={0}
            defaultValue={info.partnerPhoneNumber.substring(1)}
          />
          <TextFieldLabelDash
            label={"Địa chỉ"}
            placeholder={"Nhập địa chỉ"}
            itemKey={"partnerAddress"}
            callbackChangeValue={handleChange}
            key={"dia chi"}
            defaultValue={info.partnerAddress}
          />
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <Button color="cyan" variant="solid" onClick={onEdit}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default ShowBoxEdit;
