import PieChartCustom from "../PieChartCustom";
import { dataPie1, dataPie2 } from "./dataTest";

const TkTicketOfPartner = ({ info }) => {
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
        <PieChartCustom nameChart={"vé"} data={dataPie2} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <PieChartCustom nameChart={"Vé theo phương tiện"} data={dataPie1} />
      </div>
    </div>
  );
};

export default TkTicketOfPartner;
