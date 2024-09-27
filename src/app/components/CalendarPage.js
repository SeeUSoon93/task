"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Calendar, Badge, Card } from "antd";
import dayjs from "dayjs";
import locale from "antd/es/calendar/locale/ko_KR"; // 한국어 로케일 가져오기
import "dayjs/locale/ko"; // dayjs 한글 로케일 설정
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function CalendarPage() {
  const [taskData, setTaskData] = useState([]);

  // Firebase에서 task 데이터 가져오기
  const getTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "task"));
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTaskData(tasks);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // 날짜에 맞는 리스트 데이터 필터링
  const getListData = (value) => {
    const dateString = value.format("YYYY-MM-DD"); // dayjs를 이용하여 포맷 맞추기
    return taskData
      .filter((task) => task.deadline === dateString) // deadline과 날짜가 같은 것만 필터링
      .map((task) => ({
        type: task.isDone ? "processing" : "error", // 완료되었으면 파란색, 안 했으면 빨간색
        content: `${task.category}→${task.title}` // 표시할 내용
      }));
  };

  // 달력에 표시할 각 날짜의 데이터를 렌더링하는 함수
  const cellRender = (value) => {
    const listData = getListData(value); // 해당 날짜에 맞는 데이터 필터링
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type}
              text={item.content}
              style={{
                fontFamily: "SUITE700",
                fontSize: "18px"
              }}
            />
          </li>
        ))}
      </ul>
    );
  };

  const headerRender = ({ value, onChange }) => {
    const currentMonth = value.format("YYYY년 MM월"); // 현재 년도와 월 표시
    // 이전 달로 이동
    const prevMonth = () => {
      const newValue = value.subtract(1, "month");
      onChange(newValue);
    };

    // 다음 달로 이동
    const nextMonth = () => {
      const newValue = value.add(1, "month");
      onChange(newValue);
    };
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center", // 월을 가운데 정렬
          alignItems: "center",
          marginBottom: "30px",
          fontSize: "25px"
        }}
      >
        <MdOutlineKeyboardArrowLeft
          onClick={prevMonth}
          style={{
            border: "none",
            color: "black",
            background: "none",
            cursor: "pointer",
            marginRight: "20px"
          }}
        />
        {/* 이전 달로 이동 */}
        {currentMonth}
        <MdOutlineKeyboardArrowRight
          onClick={nextMonth}
          style={{
            border: "none",
            color: "black",
            background: "none",
            cursor: "pointer",
            marginLeft: "20px"
          }}
        />
      </div>
    );
  };
  return (
    <div style={{ padding: "0 20px" }}>
      <div style={{ marginTop: "20px" }}>
        <Calendar
          locale={locale}
          headerRender={headerRender}
          cellRender={cellRender}
          style={{
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.4)",
            borderRadius: "25px",
            padding: "40px",
            fontFamily: "SUITE800",
            fontSize: "16px"
          }}
        />
      </div>
    </div>
  );
}
