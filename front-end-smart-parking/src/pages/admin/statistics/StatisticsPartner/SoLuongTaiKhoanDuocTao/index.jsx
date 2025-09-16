import PieChartCustom from "@/components/chart/PieChartCustom";

const SoLuongTaiKhoanDuocTao = ({month, year}) => {
  const data = [
    { name: "Tài khoản tạo", value: 100 },
    { name: "Tài khoản đã có", value: 500 }
  ]
  return (
    <div className='SoLuongTaiKhoanDuocTao'>
      <PieChartCustom nameChart={`Tài khoản đã tạo - tháng ${month}/${year}`} data={data} />
    </div>
  );
};

export default SoLuongTaiKhoanDuocTao;