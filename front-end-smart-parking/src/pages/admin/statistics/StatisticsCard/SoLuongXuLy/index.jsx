import PieChartCustom from "@/components/chart/PieChartCustom";

const SoLuongXuLy = ({month, year}) => {
    const data = [
    {name: "Chờ duyệt", value: 100},
    {name: "Chờ cấp", value: 20},
    {name: "Từ chối", value: 20},
  ]
  return (
    <div className='SoLuongXuLy'>
      <PieChartCustom nameChart={`Yêu cầu xử lý - tháng ${month}/${year}`} data={data}/>
    </div>
  );
};

export default SoLuongXuLy;