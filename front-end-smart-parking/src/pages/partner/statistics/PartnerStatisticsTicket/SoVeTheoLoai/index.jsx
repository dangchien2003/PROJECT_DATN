import PieChartCustom from "@/components/chart/PieChartCustom";

const SoVeTheoLoai = () => {
  const data = [
    {
      name: "Vé giờ",
      value: "20"
    }, 
    {
      name: "Vé ngày",
      value: "50"
    }, 
    {
      name: "Vé tuần",
      value: "50"
    }, 
    {
      name: "Vé tháng",
      value: "50"
    }
  ]
  return (
    <div className='SoVeTheoLoai'>
      <PieChartCustom nameChart={"Số vé theo loại"} height={400} data={data}/>
    </div>
  );
};

export default SoVeTheoLoai;