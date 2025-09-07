import GroupedBarChart from "@/components/chart/GroupedBarChart";

const ThongKeVeVaDiaDiem = () => {
  const data = {
  categories: [
    '1Cao tốc Bắc Kan - Cao Bằng ',
    '2Cao tốc Hòa Lạc - Hòa Bình', 
    '3Cao tốc Hòa Bình - Mộc Châu',
    '4Cao tốc Hòa Bình - Mộc Châu',
    '5Cao tốc Hòa Bình - Mộc Châu',
    '6Cao tốc Hòa Bình - Mộc Châu',
    '7Cao tốc Hòa Bình - Mộc Châu',
    '8Cao tốc Hòa Bình - Mộc Châu',
  ],
  series1: [829, 829, 829, 829, 829, 829, 829, 829, 829, 829],
  series2: [615, 615, 615, 615, 615, 615, 615, 615, 615, 615]
};
  return (
    <div className='ThongKeVeVaDiaDiem'>
      <GroupedBarChart nameChart={"Số lượng vé và địa điểm hoạt động của đối tác"} seriesNames={["Địa điểm", "Vé"]} data={data} height={500}/>
    </div>
  );
};

export default ThongKeVeVaDiaDiem;