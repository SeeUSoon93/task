"use client";

import CardList from "./cardComponents/CardList";
import ScheduleHeader from "./SchedulHeader";
import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Schedule({ mobile, user }) {
  const [taskData, setTaskData] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "task"));
      const tasks = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((task) => task.userUid === user.uid);
      setTaskData(tasks);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  }, [user]); // user가 변경될 때만 이 함수가 변경됨

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]); // 이제 fetchTasks가 의존성 배열에 있어도 안전

  // 새로운 작업 추가 후 데이터를 다시 불러옴
  const handleTaskAdded = (newTask) => {
    // 우선 로컬 상태에 새 작업을 반영
    setTaskData((prevTasks) => [...prevTasks, newTask]);

    // 이후 전체 데이터를 다시 불러옴
    fetchTasks();
  };

  // 데이터를 정렬하는 함수
  const sortedData = useMemo(() => {
    return [...taskData].sort((a, b) => {
      // 1. percenter가 100이 아닌 항목을 우선
      if (a.percenter !== 100 && b.percenter === 100) {
        return -1;
      }
      if (a.percenter === 100 && b.percenter !== 100) {
        return 1;
      }

      // 2. percenter가 동일하면 deadline으로 정렬 (빠른 순서대로)
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateA - dateB;
    });
  }, [taskData]); // data가 변경될 때마다 정렬

  const colorData = [
    { category: "표지 디자인", color: "blue" },
    { category: "PPT 디자인", color: "green" },
    { category: "개발", color: "purple" },
    { category: "문서 작성", color: "yellow" },
    { category: "기타", color: "red" }
  ];

  return (
    <div style={{ padding: "0 20px" }}>
      <ScheduleHeader handleTaskAdded={handleTaskAdded} user={user} />
      <div style={{ marginTop: "20px" }}>
        <CardList data={sortedData} colorData={colorData} mobile={mobile} />
      </div>
    </div>
  );
}
