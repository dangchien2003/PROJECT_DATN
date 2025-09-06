import PieChartCustom from "@/components/chart/PieChartCustom";

const SoVeChinhSua = () => {
  const data = [{ name: "Vé giờ", value: 124 }, { name: "Vé ngày", value: 500 }, { name: "Vé tuần", value: 100 }, { name: "Vé tháng", value: 50 }]
  return (
    <div className='SoVeChinhSua'>
      <PieChartCustom nameChart={"Số vé đang hoạt động theo loại"} data={data}/>
    </div>
  );
};

export default SoVeChinhSua;