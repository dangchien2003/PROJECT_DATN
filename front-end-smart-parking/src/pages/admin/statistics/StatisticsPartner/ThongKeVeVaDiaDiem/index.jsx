import GroupedBarChart from "@/components/chart/GroupedBarChart";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const ThongKeVeVaDiaDiem = ({month, year}) => {
  const query = `
  SELECT 
    a.partner_full_name AS ten_doi_tac,
    COALESCE(COUNT(DISTINCT l.location_id), 0) AS so_dia_diem,
    COALESCE(COUNT(DISTINCT t.ticket_id), 0) AS so_ve
FROM 
    account a
    LEFT JOIN location l ON a.id = l.partner_id
    LEFT JOIN ticket t ON a.id = t.partner_id
WHERE 
    a.category = 1
GROUP BY 
    a.id, 
    a.partner_full_name
ORDER BY 
    a.partner_full_name;

  `
  const [data, setData] = useState();
  useEffect(() => {
    getDataStatistic(query).then(response => {
      const result = {
        categories: [],
        series1: [],
        series2: [],
      };
      response.data?.forEach(element => {
        result.categories.push(element.ten_doi_tac);
        result.series1.push(element.so_dia_diem);
        result.series2.push(element.so_ve);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  return (
    <div className='ThongKeVeVaDiaDiem'>
      <GroupedBarChart nameChart={`Số lượng vé và địa điểm hoạt động của đối tác - tháng ${month}/${year}`} seriesNames={["Địa điểm", "Vé"]} data={data} height={500}/>
    </div>
  );
};

export default ThongKeVeVaDiaDiem;