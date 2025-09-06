import AreaChartCustom from "@/components/AreaChartCustom";
import DividerCustom from "@/components/DividerCustom";
import PieChartCustom from "@/components/chart/PieChartCustom";
import { getStatisticalAreaAtHomeByAdmin, getStatisticalPieAtHomeByAdmin } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";

const DashboardChart = () => {
  const [dataPie, setDataPie] = useState({});
  const [dataArea, setDataArea] = useState({});

  useEffect(() => {
    // pie
    getStatisticalPieAtHomeByAdmin().then(response => {
      const result = getDataApi(response);
      setDataPie(result);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    })

    // area
    getStatisticalAreaAtHomeByAdmin().then(response => {
    const result = getDataApi(response);
      setDataArea(result);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  return (
    <div style={{ padding: "0 100px" }}>
      <Row style={{ height: 400 }} gutter={50}>
        <Col sm={24} md={24} lg={12}>
          <PieChartCustom
            data={dataPie.ve}
            nameChart={"Vé gia hạn - Không gia hạn"}
            height={400}
          />
        </Col>
        <Col sm={24} md={24} lg={12}>
          <PieChartCustom
            data={dataPie.soTienTheoMucDich}
            nameChart={"Số tiền theo mục đích"}
            height={400}
          />
        </Col>
      </Row>
      <DividerCustom style={{ width: "80%" }} />
      <Row style={{paddingTop: 50}}>
        <Col sm={24} md={24} lg={24}>
          <AreaChartCustom
            data={dataArea}
            nameChart={"Doanh thu qua các ngày"}
            height={500}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardChart;
