import PieChartCustom from "@/components/chart/PieChartCustom";

const SoLuotThayDoiThongTin = ({month, year}) => {
  const data = [
    {
      name: "Thêm mới",
      value: "20"
    }, 
    {
      name: "Chỉnh sửa",
      value: "50"
    }
  ]
  return (
    <div className='SoLuotThayDoiThongTin'>
      <PieChartCustom nameChart={`Số địa điểm thay đổi thông tin - tháng ${month}/${year}`} height={400} data={data}/>
    </div>
  );
};

export default SoLuotThayDoiThongTin;