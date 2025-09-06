import PieChartCustom from "@/components/chart/PieChartCustom";

const TiLeSuDungQrVaThe = () => {
  const data = [
    { name: "Sử dụng thẻ", value: 100 },
    { name: "Sử dụng mã QR", value: 20 },
  ]
  return (
    <div className='TiLeSuDungQrVaThe'>
      <PieChartCustom nameChart={"Tỉ lệ sử dụng thẻ và và QR - Tháng 8/2025"} data={data} />
    </div>
  );
};

export default TiLeSuDungQrVaThe;