import PieChartCustom from "@/components/chart/PieChartCustom";

const TiLeSuDungQrVaThe = ({month, year}) => {
  const data = [
    { name: "Sử dụng thẻ", value: 100 },
    { name: "Sử dụng mã QR", value: 20 },
  ]
  return (
    <div className='TiLeSuDungQrVaThe'>
      <PieChartCustom nameChart={`Tỉ lệ sử dụng thẻ và và QR - tháng ${month}/${year}`} data={data} />
    </div>
  );
};

export default TiLeSuDungQrVaThe;