import PieChartCustom from "@/components/chart/PieChartCustom";

const SoTaiKhoanTaoTrongThang = () => {
  const data = [
    { name: "Tài khoản đã tạo", value: 10 },
    { name: "Tài khoản đã có", value: 100 },
  ]
  return (
    <div className='SoTaiKhoanTaoTrongThang'>
      <PieChartCustom nameChart={"Tài khoản đã tạo - Tháng 8/2025"} data={data}/>
    </div>
  );
};

export default SoTaiKhoanTaoTrongThang;