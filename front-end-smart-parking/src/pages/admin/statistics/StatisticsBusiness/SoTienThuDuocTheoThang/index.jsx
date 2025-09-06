import BarChartCustom from '@/components/BarChartCustom';
import './style.css'
import dayjs from 'dayjs'

const SoTienThuDuocTheoThang = () => {
  return (
    <div className='SoTienThuDuocTheoThang'>
      <BarChartCustom nameChart={"Doanh thu năm " + dayjs().year()} nameX={"Tháng"} nameY={"Doanh thu"}/>
    </div>
  );
};

export default SoTienThuDuocTheoThang;