import PieChartCustom from "@/components/chart/PieChartCustom";

const SoLuotThayDoiThongTin = () => {
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
      <PieChartCustom nameChart={"Số lượt thay đổi thông tin - tháng 8/2025"} height={400} data={data}/>
    </div>
  );
};

export default SoLuotThayDoiThongTin;