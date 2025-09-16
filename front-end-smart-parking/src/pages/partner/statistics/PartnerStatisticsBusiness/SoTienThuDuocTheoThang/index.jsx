import BarChartCustom from '@/components/chart/BarChartCustom';
import './style.css'

const SoTienThuDuocTheoThang = ({year}) => {
  return (
    <div className='SoTienThuDuocTheoThang'>
      <BarChartCustom nameChart={"Doanh thu năm " + year} nameX={"Tháng"} nameY={"Doanh thu"}/>
    </div>
  );
};

export default SoTienThuDuocTheoThang;