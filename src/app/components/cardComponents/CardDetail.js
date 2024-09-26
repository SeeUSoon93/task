import { Tag, DatePicker } from "antd";
import { LuCalendarCheck2 } from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import CardProgress from "./CardProgress";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function CardDetail({ item, colorData, isDone }) {
  const color = colorData.find((data) => data.category === item.category).color;
  const [deadline, setDeadline] = useState(item.deadline); // 날짜 상태
  const [editDeadline, setEditDeadline] = useState(false); // 날짜 수정 상태

  // 날짜 변경 후 상태 업데이트하는 함수
  const handleDateChange = (date, dateString) => {
    setDeadline(dateString);
    setEditDeadline(false); // 날짜 선택 후 DatePicker 닫기
  };

  useEffect(() => {
    setDeadline(item.deadline);
  }, [item.deadline]);

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
          defaultValue={dayjs(deadline)} // 기존 데드라인을 기본 값으로 설정
          format="YYYY-MM-DD"
          onChange={handleDateChange} // 날짜 선택 시 상태 업데이트
          onBlur={() => setEditDeadline(false)} // DatePicker 외부 클릭 시 닫힘
        />
      )}

      {/* 메모 */}
      <p
        style={{ fontFamily: "SUITE600", fontSize: "18px", marginTop: "15px" }}
      >
        {item.memo}
      </p>

      {/* 진행 상태 */}
      <CardProgress item={item} isDone={isDone} />
    </div>
  );
}
