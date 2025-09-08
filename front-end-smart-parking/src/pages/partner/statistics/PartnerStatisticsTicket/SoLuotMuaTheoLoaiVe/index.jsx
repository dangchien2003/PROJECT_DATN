import PieChartCustom from "@/components/chart/PieChartCustom";

const SoLuotMuaTheoLoaiVe = () => {
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
    <div className='SoLuotMuaTheoLoaiVe'>
      <PieChartCustom nameChart={"Số lượt mua theo loại vé - tháng 8/2025"} height={400} data={data}/>
    </div>
  );
};

export default SoLuotMuaTheoLoaiVe;