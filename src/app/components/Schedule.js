"use client";

import CardList from "./cardComponents/CardList";
import ScheduleHeader from "./cardComponents/SchedulHeader";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Schedule() {
  const [taskData, setTaskData] = useState([]);

  const getTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "task")); // "task" 컬렉션의 데이터 가져오기
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTaskData(tasks);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const colorData = [
    { category: "표지 디자인", color: "blue" },
    { category: "PPT 디자인", color: "green" },
    { category: "기타", color: "red" },
  ];

  return (
    <div style={{ padding: "0 20px" }}>
      <ScheduleHeader />
      <div style={{ marginTop: "20px" }}>
        <CardList data={taskData} colorData={colorData} />
      </div>
    </div>
  );
}
