const WapperCenter = ({
  children,
  nameChart }) => {
  return (
    <div
      style={{
        padding: 16,
        borderTop: "1px solid #B9B7B7",
        position: "relative",
        marginRight: 8,
      }}
    >
      <div style={{
        position: "absolute",
        top: -18,
        display: "block",
        width: "100%",
        textAlign: "center",
        background: "transparent",
        padding: "3px 4px",
        fontSize: 19,
        color: "black",
      }}>
        <span
          style={{
            background: "white",
            padding: "0 5px"
          }}
        >
          {nameChart}
        </span>
      </div>
      {children}
    </div>
  );
};

export default WapperCenter;