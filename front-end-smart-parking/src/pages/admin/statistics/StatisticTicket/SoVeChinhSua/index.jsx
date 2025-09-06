import PieChartCustom from "@/components/chart/PieChartCustom";

const SoVeChinhSua = () => {
  const data = [{name: "Thêm mới", value: 124}, {name: "Chỉnh sửa", value: 200}]
  return (
    <div className='SoVeChinhSua'>
      <PieChartCustom nameChart={"Lượng vé chỉnh sửa trong tháng"} data={data} height={400}/>
    </div>
  );
};

export default SoVeChinhSua;