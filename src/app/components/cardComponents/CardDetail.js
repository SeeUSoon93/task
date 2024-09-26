import { Tag, DatePicker, Input, Button } from "antd";
import { LuCalendarCheck2 } from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import CardProgress from "./CardProgress";
import { useState } from "react";
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 설정 가져오기
import { CiEdit } from "react-icons/ci";

export default function CardDetail({ item, colorData, isDone, setIsDone }) {
  const color = colorData.find((data) => data.category === item.category).color;
  const [deadline, setDeadline] = useState(item.deadline); // 날짜 상태
  const [editDeadline, setEditDeadline] = useState(false); // 날짜 수정 상태
  const [isEdit, setIsEdit] = useState(false);
  const [memo, setMemo] = useState(item.memo);

  // 날짜 변경 후 상태 업데이트하는 함수
  const handleDateChange = async (date, dateString) => {
    setDeadline(dateString);
    setEditDeadline(false);
    try {
      const taskDocRef = doc(db, "task", item.id);
      await updateDoc(taskDocRef, { deadline: dateString });
    } catch (error) {
      console.error("Error updating deadline in Firebase: ", error);
    }
  };

  const handleEditClick = () => {
    setIsEdit(true);
  };
  const handleInputChange = async (e) => {
    const newMemo = e.target.value;
    setMemo(newMemo);

    try {
      const taskDocRef = doc(db, "task", item.id);
      await updateDoc(taskDocRef, { memo: newMemo });
    } catch (error) {
      console.error(error);
    }
  };
  const handleInputBlur = () => {
    setIsEdit(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEdit(false);
    }
  };

  return (
    <div>
      {/* 카테고리 태그 */}
      <Tag
        color={color}
        style={{
          fontSize: "15px",
          fontFamily: "SUITE600",
          margin: "10px 0",
          borderRadius: "15px",
          boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", margin: "3px" }}>
          <BiCategoryAlt style={{ marginRight: "5px" }} />
          <p>{item.category}</p>
        </div>
      </Tag>

      {/* 데드라인 태그 - 클릭 시 DatePicker 표시 */}
      {!editDeadline ? (
        <Tag
          style={{
            fontSize: "15px",
            fontFamily: "SUITE600",
            margin: "10px 10px",
            borderRadius: "15px",
            boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)",
            cursor: "pointer", // 클릭할 수 있음을 나타내는 커서
          }}
          onClick={() => setEditDeadline(true)} // 태그 클릭 시 DatePicker 열림
        >
          <div style={{ display: "flex", alignItems: "center", margin: "3px" }}>
            <LuCalendarCheck2 style={{ marginRight: "5px" }} />
            <p>{deadline}</p> {/* 수정된 데드라인 표시 */}
          </div>
        </Tag>
      ) : (
        <DatePicker
          style={{
            margin: "10px 10px",
            borderRadius: "15px",
            boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)",
            fontFamily: "SUITE600",
          }}
          defaultValue={dayjs(deadline)} // 기존 데드라인을 기본 값으로 설정
          format="YYYY-MM-DD"
          onChange={handleDateChange} // 날짜 선택 시 상태 업데이트
        />
      )}

      {/* 메모 */}
      {!isEdit ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <p
            style={{
              fontFamily: "SUITE600",
              fontSize: "18px",
              marginTop: "15px",
            }}
          >
            {item.memo}
          </p>
          <Button
            type="text"
            icon={<CiEdit style={{ fontSize: "18px", color: "white" }} />}
            style={{
              marginLeft: "10px",
              marginTop: "15px",
              borderRadius: "50%",
              background: "rgba(0, 0, 0, 0.6)",
              boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.5)",
            }}
            onClick={handleEditClick}
          />
        </div>
      ) : (
        <Input
          value={item.memo}
          style={{
            fontFamily: "SUITE600",
            fontSize: "18px",
            marginTop: "15px",
          }}
          onChange={handleInputChange} // 값 변경 시 상태 업데이트
          onBlur={handleInputBlur} // Input 외부를 클릭하면 수정 완료
          onKeyPress={handleKeyPress} // Enter 키를 누르면 수정 완료
          autoFocus
        />
      )}

      {/* 진행 상태 */}
      <CardProgress item={item} isDone={isDone} setIsDone={setIsDone} />
    </div>
  );
}
