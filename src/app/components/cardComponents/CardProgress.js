import { Card, Progress, Input } from "antd";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 설정 가져오기

export default function CardProgress({ item, isDone, setIsDone }) {
  const [percent, setPercent] = useState(item.percenter);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (isDone) {
      setPercent(100);
    } else {
      setPercent(0);
    }
  }, [isDone, item]);

  const handleProgressClick = () => {
    setIsEdit(true);
  };
  const handleInputChange = async (e) => {
    let newPercent = Number(e.target.value);
    if (newPercent >= 100) {
      newPercent = 100;
    }
    setPercent(newPercent);

    try {
      const taskDocRef = doc(db, "task", item.id);
      await updateDoc(taskDocRef, { percenter: newPercent });
      if (newPercent >= 100) {
        setIsDone(true);
        await updateDoc(taskDocRef, { isDone: true });
      } else {
        setIsDone(false);
        await updateDoc(taskDocRef, { isDone: false });
      }
    } catch (error) {
      console.error("Error updating percenter in Firebase: ", error);
    }
  };
  const handleInputBlur = () => {
    setIsEdit(false); // 수정 완료 후 Progress로 돌아감
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEdit(false); // Enter 키로 수정 완료
    }
  };

  return (
    <Card
      style={{
        margin: "20px 0px",
        display: "flex",
        justifyContent: "center",
        borderRadius: "15px",
        border: "none",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)"
      }}
    >
      {!isEdit ? (
        <Progress
          type="circle"
          percent={percent}
          style={{ fontFamily: "SUITE600", cursor: "pointer" }} // 클릭 가능한 커서 추가
          onClick={handleProgressClick} // Progress 클릭 시 편집 모드로 전환
        />
      ) : (
        <Input
          value={percent}
          onChange={handleInputChange} // 값 변경 시 상태 업데이트
          onBlur={handleInputBlur} // Input 외부를 클릭하면 수정 완료
          onKeyPress={handleKeyPress} // Enter 키를 누르면 수정 완료
          autoFocus // Input이 표시되면 자동으로 포커스
          style={{
            width: "150px",
            fontSize: "18px",
            fontFamily: "SUITE600",
            textAlign: "center"
          }}
        />
      )}
    </Card>
  );
}
