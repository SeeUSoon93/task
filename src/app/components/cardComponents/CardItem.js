import { useState } from "react";
import { Card, Button } from "antd";
import CardDetail from "./CardDetail";
import { FaCheck } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 설정 가져오기

export default function CardItem({ item, colorData }) {
  const [isDone, setIsDone] = useState(item.isDone);

  const toggleIsDone = async () => {
    const newIsDone = !isDone;
    setIsDone(newIsDone);

    try {
      const taskDocRef = doc(db, "task", item.id);
      await updateDoc(taskDocRef, { isDone: newIsDone });
      if (newIsDone) {
        await updateDoc(taskDocRef, { percenter: 100 });
      } else {
        await updateDoc(taskDocRef, { percenter: 0 });
      }
    } catch (error) {
      console.error("Error updating isDone in Firebase: ", error);
    }
  };

  return (
    <Card
      style={{
        margin: "10px",
        width: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "25px",
            height: "25px",
          }}
        >
          <Button
            size="small"
            icon={<FaCheck color={isDone ? "black" : "white"} />}
            style={{
              width: "25px",
              height: "25px",
              boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.5)",
            }}
            onClick={toggleIsDone} // 클릭 시 상태 토글
          />
        </div>
        <h2 style={{ marginLeft: "10px" }}>{item.title}</h2>
      </div>

      <CardDetail item={item} colorData={colorData} isDone={isDone} />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
          fontSize: "16px",
          fontFamily: "SUITE600",
        }}
      >
        <p style={{ color: "gray" }}>담당 연구원 : {item.researcher}</p>
      </div>
    </Card>
  );
}
