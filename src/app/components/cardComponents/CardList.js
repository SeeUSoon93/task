import CardItem from "./CardItem";

export default function CardList({ data, colorData, mobile }) {
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
      {data.map((item) => (
        <div
          key={item.id}
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
