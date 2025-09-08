import PieChartCustom from "@/components/chart/PieChartCustom";

const LoaiKhachHang = () => {
  const data = [
    {
      name: "Khách hàng mới",
      value: "20"
    }, 
    {
      name: "Khách hàng cũ",
      value: "50"
    }
  ]
  return (
    <div className='LoaiKhachHang'>
      <PieChartCustom nameChart={"Khách hàng mới/cũ - Tháng 8/2025"} height={400} data={data}/>
    </div>
  );
};

export default LoaiKhachHang;