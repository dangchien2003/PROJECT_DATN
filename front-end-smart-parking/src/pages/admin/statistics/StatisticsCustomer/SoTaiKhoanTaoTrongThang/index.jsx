import PieChartCustom from "@/components/chart/PieChartCustom";

const SoTaiKhoanTaoTrongThang = ({month, year}) => {
  const data = [
    { name: "Tài khoản đã tạo", value: 10 },
    { name: "Tài khoản đã có", value: 100 },
  ]
  return (
    <div className='SoTaiKhoanTaoTrongThang'>
      <PieChartCustom nameChart={`Tài khoản đã tạo - tháng ${month}/${year}`} data={data}/>
    </div>
  );
};

export default SoTaiKhoanTaoTrongThang;