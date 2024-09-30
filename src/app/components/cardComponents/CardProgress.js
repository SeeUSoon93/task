import { Card, Progress, Input } from "antd";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 설정 가져오기

export default function CardProgress({ item, isDone, setIsDone }) {
  const [percent, setPercent] = useState(item.percenter);
  const [newPercent, setNewPercent] = useState(item.percenter);
  const [isEdit, setIsEdit] = useState(false);

  const multiColorGradient = {
    "0%": "#4F7CAC",
    "25%": "#C0E0DE",
    "50%": "#70CACD",
    "75%": "#2072AF",
    "90%": "#B9D9EB",
    "100%": "#4F7CAC"
  };

  useEffect(() => {
    if (isDone) {
      setPercent(100);
    } else {
      setPercent(newPercent);
    }
  }, [isDone, newPercent]);

  const handleProgressClick = () => {
    setIsEdit(true);
  };
  const handleInputChange = async (e) => {
    const inputValue = Number(e.target.value);
    const clampedValue = Math.min(inputValue, 100); // 100을 초과하지 않도록 제한
    setNewPercent(clampedValue); // 새 퍼센트를 바로 업데이트
    setPercent(clampedValue); // 바로 퍼센트 업데이트

    try {
      const taskDocRef = doc(db, "task", item.id);
      await updateDoc(taskDocRef, { percenter: clampedValue }); // 입력된 값으로 업데이트
      if (clampedValue >= 100) {
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
          strokeColor={multiColorGradient}
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
