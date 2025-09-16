import PieChartCustom from "@/components/chart/PieChartCustom";

const SoLuotMuaVeTheoLoai = ({month, year}) => {
  const data = [{ name: "Vé giờ", value: 124 }, { name: "Vé ngày", value: 500 }, { name: "Vé tuần", value: 100 }, { name: "Vé tháng", value: 50 }]
  return (
    <div className='SoLuotMuaVeTheoLoai'>
      <PieChartCustom nameChart={`Lượng vé bán theo loại - tháng ${month}/${year}`} data={data} />
    </div>
  );
};

export default SoLuotMuaVeTheoLoai;