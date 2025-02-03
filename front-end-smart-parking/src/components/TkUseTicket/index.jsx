import { Select } from "antd";
import React, { useState } from "react";
import DoubleCardDashboard from "../DoubleCardDashboard";
import { useLoading } from "@/utils/loading";

const TkUseTicket = ({ info }) => {
  const { showLoad, hideLoad } = useLoading();
  const [valueDoubleCard, setValueDoubleCard] = useState({
    times: 0,
    ratio: "0%",
  });

  const onChange = (value) => {
    showLoad();
    setTimeout(() => {
      setValueDoubleCard({
        times: 0,
        ratio: "10%",
      });
      hideLoad();
    }, 1000);
  };
  return (
    <div
      style={{
        borderLeft: "1px solid #B9B7B7",
        height: "inline",
        paddingLeft: 8,
      }}
    >
      <Select
        style={{ width: 300, marginBottom: 8 }}
        showSearch
        placeholder="Chọn địa điểm"
        onChange={onChange}
        options={[
          {
            value: "jack",
            label: "Jack",
          },
          {
            value: "lucy",
            label: "Lucy",
          },
          {
            value: "tom",
            label: "Tom",
          },
        ]}
      />
      <DoubleCardDashboard
        value={{
          title1: "Số lần",
          value1: valueDoubleCard.times,
          title2: "Tỉ lệ sử dụng",
          value2: valueDoubleCard.ratio,
        }}
      />
    </div>
  );
};

export default TkUseTicket;
