import PieChartCustom from "../PieChartCustom";
import { dataPie2 } from "./dataTest";

const TkLocationOfParner = ({ info }) => {
  return (
    <div
      style={{
        borderLeft: "1px solid #B9B7B7",
        height: "inline",
        paddingLeft: 8,
        paddingTop: 8,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <PieChartCustom nameChart={"Địa điểm"} data={dataPie2} />
      </div>
    </div>
  );
};

export default TkLocationOfParner;
