import PieChartCustom from "@/components/chart/PieChartCustom";

const SoLuotThayDoiThongTin = ({month, year}) => {
  const data = [
    {
      name: "Thay đổi",
      value: "20"
    }, 
    {
      name: "Không thay đổi",
      value: "50"
    }
  ]
  return (
    <div className='SoLuotThayDoiThongTin'>
      <PieChartCustom nameChart={`Số lượt thay đổi thông tin - tháng ${month}/${year}`} height={400} data={data}/>
    </div>
  );
};

export default SoLuotThayDoiThongTin;