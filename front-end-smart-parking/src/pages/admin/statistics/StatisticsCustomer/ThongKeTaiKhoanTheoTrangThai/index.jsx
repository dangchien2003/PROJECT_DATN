import PieChartCustom from "@/components/chart/PieChartCustom";

const ThongKeTaiKhoanTheoTrangThai = () => {
  const data = [
    { name: "Đã khoá", value: 100 },
    { name: "Khoá tạm thời", value: 50 },
    { name: "Đang hoạt động", value: 500 },
  ]
  return (
    <div className='ThongKeTaiKhoanTheoTrangThai'>
      <PieChartCustom nameChart={"Thống kê theo trạng thái"} data={data} />
    </div>
  );
};

export default ThongKeTaiKhoanTheoTrangThai;