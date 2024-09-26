import { Card, Progress } from "antd";
import { useState, useEffect } from "react";

export default function CardProgress({ item, isDone }) {
  const [percent, setPercent] = useState(item.percenter);

  useEffect(() => {
    if (isDone) {
      setPercent(100);
    } else {
      setPercent(item.percenter);
    }
  }, [isDone, item]);

  return (
    <Card
      style={{
        margin: "20px 0px",
        display: "flex",
        justifyContent: "center",
        borderRadius: "15px",
        border: "none",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Progress
        type="circle"
        percent={percent}
        style={{ fontFamily: "SUITE600" }}
      />
    </Card>
  );
}
