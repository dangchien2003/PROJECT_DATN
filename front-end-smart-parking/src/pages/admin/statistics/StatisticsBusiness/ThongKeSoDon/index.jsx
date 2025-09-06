import PieChartCustom from "@/components/PieChartCustom";

const ThongKeSoDon = () => {
  return (
    <div className='ThongKeSoDon'>
      <PieChartCustom nameChart={"Tỉ lệ đơn thành công/thất bại"} height={500}/>
    </div>
  );
};

export default ThongKeSoDon;