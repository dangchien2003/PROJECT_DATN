import HorizontalBarChart from "@/components/chart/HorizontalBarChart";

const Top10TaiKhoanCoMucTieuDungCaoNhat = ({month, year}) => {
  const data = {
    categories: ["Đại học công nghệ đông á", "EAON MALL hà đông", "Đại học công nghệ đông á", "EAON MALL hà đông", "Đại học công nghệ đông á"],
    values: [50000, 40, 30, 20, 15]
  }
  return (
    <div className='Top10TaiKhoanCoMucTieuDungCaoNhat'>
      <HorizontalBarChart nameChart={`Top 10 tài khoản có mức tiêu dùng cao nhất - tháng ${month}/${year}`} data={data} />
    </div>
  );
};

export default Top10TaiKhoanCoMucTieuDungCaoNhat;