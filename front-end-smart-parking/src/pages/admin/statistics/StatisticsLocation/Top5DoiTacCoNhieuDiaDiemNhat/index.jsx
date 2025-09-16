import HorizontalBarChart from "@/components/chart/HorizontalBarChart";

const Top5DoiTacCoNhieuDiaDiemNhat = () => {
  const data = {
    categories: ["Đại học công nghệ đông á", "EAON MALL hà đông", "Đại học công nghệ đông á", "EAON MALL hà đông", "Đại học công nghệ đông á"],
    values: [50, 40, 30, 20, 15]
  }
  return (
    <div className='Top5DoiTacCoNhieuDiaDiemNhat'>
      <HorizontalBarChart nameChart={`Top 5 đối tác có nhiều địa điểm nhất`} nameX={"Số địa điểm"} data={data}/>
    </div>
  );
};

export default Top5DoiTacCoNhieuDiaDiemNhat;