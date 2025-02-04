import TableCustomLocationOfParner from "@/components/TableCustomLocationOfParner";
import TkLocationOfParner from "@/components/TkLocationOfParner";

const Location = ({ info }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div style={{ paddingRight: 16, width: 800 }}>
        <TableCustomLocationOfParner />
      </div>
      <div>
        <TkLocationOfParner />
      </div>
    </div>
  );
};

export default Location;
