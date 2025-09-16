import HorizontalBarChart from "@/components/chart/HorizontalBarChart";

const Top5DiaDiemCoNhieuViTriNhat = ({month, year}) => {
  const data = {
    categories: ["Đại học công nghệ đông á", "EAON MALL hà đông", "Đại học công nghệ đông á", "EAON MALL hà đông", "Đại học công nghệ đông á"],
    values: [50, 40, 30, 20, 15]
  }
  return (
    <div className='Top5DiaDiemCoNhieuViTriNhat'>
      <HorizontalBarChart nameChart={"Top 5 địa điểm có nhiều vị trí nhất"} nameX={"Số vị trí"} data={data} />
    </div>
  );
};

export default Top5DiaDiemCoNhieuViTriNhat;