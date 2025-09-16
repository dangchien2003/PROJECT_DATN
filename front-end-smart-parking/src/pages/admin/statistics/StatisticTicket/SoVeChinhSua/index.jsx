import PieChartCustom from "@/components/chart/PieChartCustom";

const SoVeChinhSua = ({month, year}) => {
  const data = [{name: "Thêm mới", value: 124}, {name: "Chỉnh sửa", value: 200}]
  return (
    <div className='SoVeChinhSua'>
      <PieChartCustom nameChart={`Lượng vé chỉnh sửa trong - tháng ${month}/${year}`} data={data} height={400}/>
    </div>
  );
};

export default SoVeChinhSua;