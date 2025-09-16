import PieChartCustom from "@/components/chart/PieChartCustom";

const ThongKeSoDon = ({month, year}) => {
  return (
    <div className='ThongKeSoDon'>
      <PieChartCustom nameChart={`Tỉ lệ đơn thành công/thất bại - tháng ${month}/${year}`} height={500}/>
    </div>
  );
};

export default ThongKeSoDon;