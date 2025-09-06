import HorizontalBarChart from '@/components/chart/HorizontalBarChart';
import './style.css'

const Top5DoiTacCoDoanhThuCaoNhat = () => {
  return (
    <div className='Top5DoiTacCoDoanhThuCaoNhat'>
      <HorizontalBarChart nameChart={"Top 5 đối tác có doanh thu cao nhất tháng 5"} />
    </div>
  );
};

export default Top5DoiTacCoDoanhThuCaoNhat;