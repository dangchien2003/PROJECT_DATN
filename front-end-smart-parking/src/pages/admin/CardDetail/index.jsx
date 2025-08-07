import CardCustom from "@/components/CardCustom";
import TableActionHistoryCard from "@/components/TableActionHistoryCard";
import { useLoading } from "@/hook/loading";
import { detailCardByadmin } from "@/service/cardService";
import { getDataApi } from "@/utils/api";
import { CARD_STATUS_2 } from "@/utils/constants";
import { toastError } from "@/utils/toast";
import { Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardAction from "./CardAction";
import HistoryRequestAdditionalCardOfCustomer from "./HistoryRequestAdditionalCardOfCustomer";
import "./style.css";
const { Title } = Typography;


const CardDetail = () => {
  const { waiting, id } = useParams();
  const { showLoad, hideLoad } = useLoading();
  const [data, setData] = useState();
  useEffect(() => {
    showLoad();
    detailCardByadmin(id).then(response => {
      const result = getDataApi(response);
      setData(result);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(hideLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const isWaitApprove = waiting === "1"
  return (
    <div className="card-detail">
      <Row>
        <Col xs={24} sm={24} md={12} lg={12}>
          <div className="detail">
            <div>
              <Title style={{ padding: "0 8px" }} level={5}>{isWaitApprove ? "Thông tin yêu cầu" : "Thông tin thẻ"}</Title>
              <div >
                <div>
                  <CardCustom isAdmin={true} data={data} />
                  {data?.status === CARD_STATUS_2.CHO_DUYET.value && <div className="action">
                    <CardAction isWaitApprove={isWaitApprove} data={data}/>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          {!isWaitApprove && <div className="history">
            <Title style={{ padding: "0 16px" }} level={5}>Lịch sử hoạt động</Title>
            <div style={{ paddingLeft: 8, width: "100%" }}>
              <TableActionHistoryCard />
            </div>
          </div>}
          {(isWaitApprove && data) && <div className="history">
            <Title style={{ padding: "0 16px" }} level={5}>Lịch sử yêu cầu</Title>
            <div style={{ paddingLeft: 8, width: "100%" }}>
              <HistoryRequestAdditionalCardOfCustomer accountId={data.accountId} />
            </div>
          </div>}
        </Col>
      </Row>

    </div>
  )
}

export default CardDetail
