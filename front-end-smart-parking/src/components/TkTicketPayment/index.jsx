import PieChartCustom from "../PieChartCustom";
import { dataPie, dataPie1, dataPie2 } from "./dataTest";
import { formatCurrency } from "@/utils/number";

const TkTicketPayment = ({ info }) => {
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
        <PieChartCustom nameChart={"Thanh toán"} data={dataPie} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <PieChartCustom
          nameChart={"Số tiền thanh toán"}
          data={dataPie1}
          convert={(value) => {
            return formatCurrency(value) + " đ";
          }}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <PieChartCustom nameChart={"Phương thức thanh toán"} data={dataPie2} />
      </div>
    </div>
  );
};

export default TkTicketPayment;
