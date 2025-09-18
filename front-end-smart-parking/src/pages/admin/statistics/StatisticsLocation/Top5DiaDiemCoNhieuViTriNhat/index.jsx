import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const Top5DiaDiemCoNhieuViTriNhat = () => {
   const query = `SELECT
    l.name,
    capacity
FROM
    location l
where status = 1
ORDER BY
    capacity DESC
LIMIT 5;`
    const [data, setData] = useState();
    useEffect(() => {
      getDataStatistic(query).then(response => {
        const result = { categories: [], values: [] }
        response.data?.forEach(item => {
          result.categories.push(item.name);
          result.values.push(item.capacity);
        });
        setData(result);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);
  return (
    <div className='Top5DiaDiemCoNhieuViTriNhat'>
      <HorizontalBarChart nameChart={"Top 5 địa điểm có nhiều vị trí nhất"} nameX={"Số vị trí"} data={data} />
    </div>
  );
};

export default Top5DiaDiemCoNhieuViTriNhat;