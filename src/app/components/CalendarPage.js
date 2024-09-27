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

// 날짜별로 task를 그룹화하는 함수
const groupTasksByDate = (tasks) => {
  return tasks.reduce((acc, task) => {
    const date = dayjs(task.deadline).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});
};

export default function CalendarPage() {
  const [taskData, setTaskData] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false); // 모바일 뷰 상태 관리

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

  useEffect(() => {
    // 모바일 화면일 때 뷰 변경
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // 화면 크기가 768px 이하일 때 모바일 뷰로 전환
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 로딩 시 한 번 호출

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
          <li key={item.content} style={{ marginBottom: "10px" }}>
            <Badge
              status={item.isDone ? "processing" : "error"}
              style={{ marginRight: "8px" }} // Badge와 텍스트 간의 여백 설정
            />
            {/* 텍스트에 스타일 적용 */}
            <span
              style={{
                fontSize: "16px",
                fontFamily: "SUITE500"
              }}
            >
              {item.content}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const headerRender = ({ value, onChange, mobile }) => {
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
  // 모바일 뷰에서 할 일 목록을 날짜별로 나열
  const renderMobileListView = () => {
    const groupedTasks = groupTasksByDate(taskData); // 날짜별로 그룹화

    return Object.keys(groupedTasks).length ? (
      Object.keys(groupedTasks).map((date) => (
        <Card
          key={date}
          style={{
            marginBottom: "10px",
            width: "100%",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            fontFamily: "SUITE800",
            fontSize: "18px"
          }}
        >
          <h3>{date}</h3>
          <ul style={{ listStyle: "none", paddingLeft: "0" }}>
            {groupedTasks[date].map((task) => (
              <li key={task.id} style={{ marginBottom: "10px" }}>
                <Badge
                  status={task.isDone ? "processing" : "error"}
                  style={{ marginRight: "8px" }} // Badge와 텍스트 간의 여백 설정
                />
                {/* 텍스트에 스타일 적용 */}
                <span
                  style={{
                    fontSize: "18px",
                    fontFamily: "SUITE500"
                  }}
                >
                  {`${task.category}→${task.title}`}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ))
    ) : (
      <p>할 일이 없습니다.</p>
    );
  };

  return (
    <div style={{ padding: "0 20px" }}>
      <div style={{ marginTop: "20px" }}>
        {isMobileView ? (
          renderMobileListView() // 모바일 뷰일 때 일별 화면 렌더링
        ) : (
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
        )}
      </div>
    </div>
  );
}
