import PieChartCustom from "@/components/chart/PieChartCustom";

const SoLuongXuLy = () => {
    const data = [
    {name: "Chờ duyệt", value: 100},
    {name: "Chờ cấp", value: 20},
    {name: "Từ chối", value: 20},
  ]
  return (
    <div className='SoLuongXuLy'>
      <PieChartCustom nameChart={"Yêu cầu xử lý - Tháng 8/2025"} data={data}/>
    </div>
  );
};

export default SoLuongXuLy;