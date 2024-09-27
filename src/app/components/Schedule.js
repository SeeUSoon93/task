"use client";

import CardList from "./cardComponents/CardList";
import ScheduleHeader from "./SchedulHeader";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Schedule({ mobile }) {
  const [taskData, setTaskData] = useState([]);

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

  const handleTaskAdded = (newTask) => {
    setTaskData((prevTasks) => [...prevTasks, newTask]);
  };
  const colorData = [
    { category: "표지 디자인", color: "blue" },
    { category: "PPT 디자인", color: "green" },
    { category: "기타", color: "red" }
  ];

  return (
    <div style={{ padding: "0 20px" }}>
      <ScheduleHeader handleTaskAdded={handleTaskAdded} />
      <div style={{ marginTop: "20px" }}>
        <CardList data={taskData} colorData={colorData} mobile={mobile} />
      </div>
    </div>
  );
}
