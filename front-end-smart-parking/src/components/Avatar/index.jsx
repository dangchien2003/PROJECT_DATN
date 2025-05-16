import { isNullOrUndefined } from "@/utils/data";

const Avatar = ({ linkImage }) => {
  return (
    <div
      style={{
        width: 210,
        height: 210,
        border: "1px solid #B9B7B7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isNullOrUndefined(linkImage) && <img
        src={linkImage}
        alt="avatar"
        style={{
          maxWidth: 200,
          maxHeight: 200,
          objectFit: "contain",
          padding: 3,
        }}
      />}
    </div>
  );
};

export default Avatar;
