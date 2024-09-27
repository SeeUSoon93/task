import CardItem from "./CardItem";
import { useMemo } from "react";

export default function CardList({ data, colorData, mobile }) {
  // 데이터를 정렬하는 함수
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      // 1. percenter가 100이 아닌 항목을 우선
      if (a.percenter !== 100 && b.percenter === 100) {
        return -1;
      }
      if (a.percenter === 100 && b.percenter !== 100) {
        return 1;
      }

      // 2. percenter가 동일하면 deadline으로 정렬 (빠른 순서대로)
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateA - dateB;
    });
  }, [data]); // data가 변경될 때마다 정렬

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap", // 여러 줄로 감싸기
        justifyContent: "space-between", // 카드 사이 간격 균등하게 배분
        gap: "16px", // 카드 간의 간격을 설정
        alignItems: "stretch" // 카드의 높이를 동일하게 설정
      }}
    >
      {sortedData.map((item, index) => (
        <div
          key={index}
          style={{
            flex: mobile ? "1 1 100%" : "1 1 calc(33.333% - 16px)", // 모바일이면 100% 너비, 아니면 33.333%
            boxSizing: "border-box", // 패딩과 마진 포함
            display: "flex",
            maxWidth: mobile ? "100%" : "calc(33.333% - 16px)" // 모바일이면 최대 너비 100%, 아니면 33.333%
          }}
        >
          <CardItem item={item} colorData={colorData} />
        </div>
      ))}
    </div>
  );
}
