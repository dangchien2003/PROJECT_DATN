import AreaChartCustom from "@/components/AreaChartCustom";
import DividerCustom from "@/components/DividerCustom";
import PieChartCustom from "@/components/chart/PieChartCustom";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs'
import { getDataStatistic, thongKeDoanhThuThangTheoDoiTac } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { getAccountId } from "@/service/localStorageService";
import HorizontalBarChart from "@/components/chart/HorizontalBarChart";

const DashboardChart = () => {
  const partnerId = getAccountId();
  const query = `
     with result as (
    select case when tp.price_extend IS NOT NULL then 1 else 0 end as mark
    from ticket_purchased tp
             join ticket t on t.ticket_id = tp.ticket_id
    where t.partner_id = '${partnerId}'
     and month(CURRENT_DATE) = month(expires) and year(CURRENT_DATE) = year(expires)
)
select
    sum(mark) as extend,
    (count(*) - sum(mark)) as noExtend
from result;
    `
  const [dataVe, setDataVe] = useState([]);

  useEffect(() => {
    getDataStatistic(query).then(response => {
      setDataVe([{ name: "Đã gia hạn", value: response.data[0].extend }, { name: "Không gia hạn", value: response.data[0].noExtend }]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const query1 = `WITH location_revenue AS (
        SELECT
            l.location_id,
            l.name AS location_name,
            SUM(p.total) AS total_parking_revenue
        FROM  payment p
            join order_parking op on op.order_id = p.object_id and p.type = 0
                JOIN
            ticket t ON op.ticket_id = t.ticket_id
                JOIN
            location l ON op.location_id = l.location_id
        WHERE
            t.partner_id = '${partnerId}' and p.type = 0
          AND YEAR(p.created_at) = ${dayjs().year()}
          AND MONTH(p.created_at) = ${dayjs().month() + 1}
          AND p.status = 2
        GROUP BY
            l.location_id,
            l.name
    
        UNION ALL
    
        SELECT
            l.location_id,
            l.name AS location_name,
            SUM(p.total) AS total_ticket_revenue
        FROM
            payment p
            join ticket_purchased tp on tp.id = p. object_id 
                JOIN
            ticket t ON tp.ticket_id = t.ticket_id
                JOIN
            location l ON t.ticket_id = l.location_id
        WHERE
            t.partner_id = '${partnerId}'
          AND YEAR(p.created_at) = ${dayjs().year()}
          AND MONTH(p.created_at) = ${dayjs().month() + 1}
          AND p.type = 1
          AND p.status = 2
        GROUP BY
            l.location_id,
            l.name
    )
    
    SELECT
        location_name,
        ROUND(SUM(total_parking_revenue), 0) AS total_revenue
    FROM
        location_revenue
    GROUP BY
        location_id,
        location_name
    ORDER BY
        total_revenue DESC
    LIMIT 5;
        `
  const [data, setData] = useState();
  useEffect(() => {
    getDataStatistic(query1).then(response => {
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push(item.location_name);
        result.values.push(item.total_revenue);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const [dataArea, setDataArea] = useState({});
  useEffect(() => {
    thongKeDoanhThuThangTheoDoiTac(dayjs().month() + 1, dayjs().year()).then(response => {
      const result = getDataApi(response);
      setDataArea(result);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    })
  }, [])
  return (
    <div>
      <Row gutter={50}>
        <Col sm={24} md={24} lg={12}>
          <PieChartCustom
            data={dataVe}
            nameChart={"Vé gia hạn - Không gia hạn"}
          />
        </Col>
        <Col sm={24} md={24} lg={12}>
          <HorizontalBarChart nameChart={`Top 5 địa điểm có doanh thu cao nhất - tháng ${dayjs().month() + 1}/${dayjs().year()}`} data={data} nameX={"Doanh thu"} />
        </Col>
      </Row>
      <DividerCustom style={{ width: "80%" }} />
      <div
      >
        <AreaChartCustom
          data={dataArea}
          nameChart={"Biến động dòng tiền qua các ngày"}
          height={500}
        />
      </div>
    </div>
  );
};

export default DashboardChart;
