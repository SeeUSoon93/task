import CardItem from "./CardItem";
import { Collapse } from "antd";
import { useState, useEffect } from "react";
export default function CardList({
  data,
  colorData,
  mobile,
  handleTaskDelete
}) {
  const [doing, setDoing] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    setDoing(data.filter((item) => item.isDone === false));
    setDone(data.filter((item) => item.isDone === true));
  }, [data]);

  const items = [
    {
      key: "1",
      label: (
        <h2 style={{ fontFamily: "SUITE800", fontSize: "18px" }}>진행중</h2>
      ),
      children: (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap", // 여러 줄로 감싸기
            justifyContent: "space-between", // 카드 사이 간격 균등하게 배분
            gap: "16px", // 카드 간의 간격을 설정
            alignItems: "stretch" // 카드의 높이를 동일하게 설정
          }}
        >
          {doing.map((item) => (
            <div
              key={item.id}
              style={{
                flex: mobile ? "1 1 100%" : "1 1 calc(33.333% - 16px)", // 모바일이면 100% 너비, 아니면 33.333%
                boxSizing: "border-box", // 패딩과 마진 포함
                display: "flex",
                maxWidth: mobile ? "100%" : "calc(33.333% - 16px)" // 모바일이면 최대 너비 100%, 아니면 33.333%
              }}
            >
              <CardItem
                item={item}
                colorData={colorData}
                handleTaskDelete={handleTaskDelete}
              />
            </div>
          ))}
        </div>
      )
    },
    {
      key: "2",
      label: <h2 style={{ fontFamily: "SUITE800", fontSize: "18px" }}>완료</h2>,
      children: (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap", // 여러 줄로 감싸기
            justifyContent: "space-between", // 카드 사이 간격 균등하게 배분
            gap: "16px", // 카드 간의 간격을 설정
            alignItems: "stretch" // 카드의 높이를 동일하게 설정
          }}
        >
          {done.map((item) => (
            <div
              key={item.id}
              style={{
                flex: mobile ? "1 1 100%" : "1 1 calc(33.333% - 16px)", // 모바일이면 100% 너비, 아니면 33.333%
                boxSizing: "border-box", // 패딩과 마진 포함
                display: "flex",
                maxWidth: mobile ? "100%" : "calc(33.333% - 16px)" // 모바일이면 최대 너비 100%, 아니면 33.333%
              }}
            >
              <CardItem
                item={item}
                colorData={colorData}
                handleTaskDelete={handleTaskDelete}
              />
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div>
      <Collapse
        defaultActiveKey={["1"]}
        items={items}
        style={{
          borderRadius: "15px"
        }}
      />
    </div>
  );
}
