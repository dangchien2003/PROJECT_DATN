import PieChartCustom from "@/components/chart/PieChartCustom";

const ThongKeDiaDiemTheoTrangThai = ({month, year}) => {
  const data = [
    {
      name: "Chờ duyệt",
      value: "10"
    },
    {
      name: "Chờ áp dụng",
      value: "10"
    },
    {
      name: "Đang hoạt động",
      value: "20"
    },
    {
      name: "Tạm dừng hoạt động",
      value: "50"
    },
    {
      name: "Dừng hoạt động",
      value: "50"
    },
  ]
  return (
    <div className='ThongKeDiaDiemTheoTrangThai'>
      <PieChartCustom nameChart={`Số địa điểm theo trạng thái - tháng ${month}/${year}`} height={400} data={data} />
    </div>
  );
};

export default ThongKeDiaDiemTheoTrangThai;