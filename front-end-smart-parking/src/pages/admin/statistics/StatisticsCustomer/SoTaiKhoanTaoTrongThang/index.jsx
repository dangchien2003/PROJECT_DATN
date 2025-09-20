import PieChartCustom from "@/components/chart/PieChartCustom";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const SoTaiKhoanTaoTrongThang = ({month, year}) => {
const query = `
  WITH
    tai_khoan_den_cuoi_thang_truoc AS (
        SELECT
            COUNT(*) AS tong_so_tai_khoan_doi_tac_den_cuoi_thang_truoc
        FROM
            account
        WHERE
            category = 2
          AND (
            YEAR(created_at) < ${year}
                OR (YEAR(created_at) = ${year} AND MONTH(created_at) < ${month})
            )
    ),
    tai_khoan_moi_trong_thang AS (
        SELECT
            COUNT(*) AS so_tai_khoan_doi_tac_moi
        FROM
            account
        WHERE
            category = 2
          AND YEAR(created_at) = ${year}
          AND MONTH(created_at) = ${month}
    )
SELECT
    so_tai_khoan_doi_tac_moi,
    tong_so_tai_khoan_doi_tac_den_cuoi_thang_truoc
FROM
    tai_khoan_moi_trong_thang,
    tai_khoan_den_cuoi_thang_truoc;
  `
  const [data, setData] = useState();
  useEffect(() => {
    if (year === undefined || month === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = [{name: "Tài khoản tạo", value: response.data?.[0].so_tai_khoan_doi_tac_moi}, {name: "Luỹ kế tháng trước", value: response.data?.[0].tong_so_tai_khoan_doi_tac_den_cuoi_thang_truoc}];
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);
  return (
    <div className='SoTaiKhoanTaoTrongThang'>
      <PieChartCustom nameChart={`Tài khoản đã tạo - tháng ${month}/${year}`} data={data}/>
    </div>
  );
};

export default SoTaiKhoanTaoTrongThang;