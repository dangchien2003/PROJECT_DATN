import CoordinateInput from "@/components/CoordinateInput";
import DatePickerLabelDash from "@/components/DatePickerLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import TimeInput from "@/components/TimeInput";
import AvatarAndVideo from "./AvatarAndVideo";
import QuillEditor from "@/components/QuillEditor";
import CheckboxWithDash from "@/components/CheckboxWithDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import { extractGoogleMapCoords } from "@/utils/extract";
import Action from "./Action";

const AddLocation = ({isModify = false}) => {
  return (
    <div>
      <h4 style={{ paddingBottom: 8 }}>Thêm mới địa điểm</h4>
      <div>
        <AvatarAndVideo/>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap"}}>
        <TextFieldLabelDash
          label={"Tên địa điểm"}
          placeholder={"Nhập tên địa điểm"}
          key={"ten dd"}
        />
        <CoordinateInput
          label={"Toạ độ (AxB)"}
          placeholder={"Nhập toạ độ"}
          key={"td"}
          defaultValue={extractGoogleMapCoords("https://www.google.com/maps/dir//21.0595931,105.7560994/@21.0596982,105.7551767,17z/data=!4m2!4m1!3e0?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D")}
          disable={true}
        />
        <TextFieldLabelDash
          label={"Đường dẫn đến Google Map"}
          placeholder={"Nhập đường dẫn Google Map"}
          key={"gg map"}
          defaultValue="https://www.google.com/maps/dir//21.0595931,105.7560994/@21.0596982,105.7551767,17z/data=!4m2!4m1!3e0?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D"
        />
        {isModify && <DatePickerLabelDash
          label={"Ngày mở cửa"}
          placeholder={"Chọn ngày mở cửa"}
          key={"ngay mo cua"} disable={true}
        />}
        <TimeInput
          label={"Thời gian mở cửa"}
          placeholder={"Chọn thời gian mở cửa"}
          key={"tgm"}
          format="HH:mm"
        />
        <TimeInput
          label={"Thời gian đóng cửa"}
          placeholder={"Chọn thời gian đóng cửa"}
          key={"tgđ"}
          format="HH:mm"
        />
        <CheckboxWithDash label={"Mở cửa mọi lúc"} value={false} key={"ml"} />
        <TextFieldLabelDash
          label={"Sức chứa"}
          placeholder={"Nhập sức chứa"}
          key={"succhua"}
          regex={/^[0-9]*$/}
          disable={true}
        />
        <DateTimePickerWithSortLabelDash label="Thời điểm áp dụng" sort={false} key={"tgad"} format={"DD/MM/YYYY HH:mm"} formatShowTime={"HH:mm"} placeholder={"Chọn thời điểm áp dụng"}/>
        <CheckboxWithDash label={"Mở cửa ngày lễ"} value={true} key={"mcnl"}/>
        <CheckboxWithDash label={"Yêu cầu duyệt khẩn cấp"} value={false} key={"dkc"}/>
      </div>
      {isModify && <div>
        <TextFieldLabelDash
          label={"Nội dung chỉnh sửa"}
          placeholder={"Nhập nội dung chỉnh sửa"}
          key={"ndcs"}
        />
      </div>}
      <div style={{paddingTop: 8}}>
        <div
          style={{
            position: "relative",
            width: 250,
            paddingBottom: 0,
            borderTop: "1px solid #B9B7B7",
            margin: 16,
          }}
        >
          <span
            className="truncated-text"
            style={{
              position: "absolute",
              display: "inline-block",
              padding: "3px 5px",
              top: -14,
              left: 8,
              maxWidth: 240,
              fontSize: 14,
              background: "white",
              zIndex: 100,
            }}
          >
            Mô tả về địa điểm
          </span>
        </div>
      <QuillEditor style={{margin: "15px 30px"}}/>
      </div>
      <Action isModify={isModify}/>
    </div>
  );
};

export default AddLocation;