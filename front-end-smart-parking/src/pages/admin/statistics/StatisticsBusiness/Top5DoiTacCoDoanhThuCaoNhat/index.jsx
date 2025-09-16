import HorizontalBarChart from '@/components/chart/HorizontalBarChart';
import './style.css'

const Top5DoiTacCoDoanhThuCaoNhat = ({month, year}) => {
  const categories = [
    "Đại học Công Nghệ Đông Á",
    "Eaon mall hà đông",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
  ];
  const values = [10.5, 10.5, 40.1, 60.2, 80.2, 10.5, 10.5, 40.1, 60.2, 80.2];
  const data = {
    categories, values
  }
  return (
    <div className='Top5DoiTacCoDoanhThuCaoNhat'>
      <HorizontalBarChart nameChart={`Top 5 đối tác có doanh thu cao nhất - tháng ${month}/${year}`} data={data} nameX={"Doanh thu"}/>
    </div>
  );
};

export default Top5DoiTacCoDoanhThuCaoNhat;