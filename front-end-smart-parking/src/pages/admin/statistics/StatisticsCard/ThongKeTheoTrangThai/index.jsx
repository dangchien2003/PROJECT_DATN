import PieChartCustom from "@/components/chart/PieChartCustom";

const ThongKeTheoTrangThai = () => {
  const data = [
    {name: "Đang sử dụng", value: 100},
    {name: "Chờ kích hoạt", value: 20},
    {name: "Tạm khoá", value: 20},
    {name: "Khoá vĩnh viễn", value: 10},
  ]
  return (
    <div className='ThongKeTheoTrangThai'>
      <PieChartCustom nameChart={"Thống kê thẻ theo trạng thái"} data={data}/>
    </div>
  );
};

export default ThongKeTheoTrangThai;