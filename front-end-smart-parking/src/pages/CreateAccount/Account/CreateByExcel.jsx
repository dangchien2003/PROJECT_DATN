import { MdCancel } from "react-icons/md";

const CreateByExcel = ({ setShowViewCreateByExcel }) => {
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
      <MdCancel
        fontSize={20}
        style={{ position: "absolute", top: 8, right: 8 }}
        onClick={() => {
          setShowViewCreateByExcel(false);
        }}
      />
    </div>
  );
};

export default CreateByExcel;
