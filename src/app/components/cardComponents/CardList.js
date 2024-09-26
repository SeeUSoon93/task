import { Row, Col } from "antd";
import CardItem from "./CardItem";

export default function CardList({ data, colorData }) {
  return (
    <Row gutter={[16, 16]} justify="center">
      {data.map((item, index) => (
        <Col
          xs={24} // 모바일에서 한 줄에 하나씩
          lg={8} // 큰 화면에서는 네 개씩
          key={index}
        >
          <CardItem item={item} colorData={colorData} />
        </Col>
      ))}
    </Row>
  );
}
