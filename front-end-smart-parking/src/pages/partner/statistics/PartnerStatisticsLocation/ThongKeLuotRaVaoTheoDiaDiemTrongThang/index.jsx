import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import React from "react";
const ThongKeLuotRaVaoTheoDiaDiemTrongThang = () => {
  const data = {
    categories: ["Đại học công nghệ đông á", "EAON MALL HÀ ĐÔNG", "EAON MALL LONG BIÊN", "Đại học công nghệ đông á", "EAON MALL HÀ ĐÔNG", "EAON MALL LONG BIÊN", "Đại học công nghệ đông á", "EAON MALL HÀ ĐÔNG", "EAON MALL LONG BIÊN"],
    values: [10, 11, 100, 10, 11, 100, 10, 11, 100]
  }
  return <div>
    <HorizontalBarChart nameChart={"Top 10 địa điểm có lượt ra vào nhiều nhất"} nameX={"Số lượt ra vào"} data={data} />
  </div>;
};

export default ThongKeLuotRaVaoTheoDiaDiemTrongThang;