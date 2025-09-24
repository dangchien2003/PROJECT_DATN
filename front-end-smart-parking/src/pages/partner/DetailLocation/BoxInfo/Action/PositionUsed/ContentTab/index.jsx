import LineLoading from "@/components/Loading/LineLoading";
import { statisticsOfUsedPositions } from "@/service/locationService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { Flex } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect, useState } from "react";
import Item from "./Item";
import './style.css';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const ContentTab = ({ date, locationId, capacity}) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    statisticsOfUsedPositions(locationId, date).then(response => {
      const result = getDataApi(response);
      const dataSet = result.map(item => ({
        key: item.time,
        value: item.quantity
      }));
      setData(dataSet)
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(() => {

    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [locationId, date])
  return (
    <div>
      {!data && <LineLoading />}
      {data && <Flex wrap className="content-tab hide-scrollbar">
        {data.map(({ key, value }) => {
          return <Item label={key} count={value} max={capacity}/>
        })}
      </Flex>}
    </div>
  );
};

export default ContentTab;