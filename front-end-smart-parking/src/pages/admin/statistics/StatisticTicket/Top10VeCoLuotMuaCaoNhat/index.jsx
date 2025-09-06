import HorizontalBarChart from "@/components/chart/HorizontalBarChart";

const Top10VeCoLuotMuaCaoNhat = () => { const categories = [
    "Vé hoàng gia - Đại học Công Nghệ Đông Á",
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
  const values = [10.5, 10.5, 40.1, 60.2, 200.2, 10.5, 10.5, 40.1, 60.2, 80.2];
  const data = {
    categories, values
  }
  return (
    <div className='Top10VeCoLuotMuaCaoNhat'>
      <HorizontalBarChart nameChart={"Top 10 vé có lượt mua cao nhất"} data={data} nameX={"Số đơn"} height={400}/>
    </div>
  );
};

export default Top10VeCoLuotMuaCaoNhat;