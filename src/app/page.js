"use client";

import styles from "./page.module.css";
import { Tabs } from "antd";
import Schedule from "./components/Schedule";
import CalendarPage from "./components/CalendarPage";
import MyPage from "./components/MyPage";
import { MobileContext } from "./MobileContext";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Home() {
  const { user } = useContext(UserContext);
  const { mobile } = useContext(MobileContext);

  const [activeKey, setActiveKey] = useState("3"); // 기본적으로 마이페이지로 설정

  useEffect(() => {
    if (!user) {
      setActiveKey("3"); // 유저가 없으면 마이페이지로 강제 이동
    } else {
      setActiveKey("1");
    }
  }, [user]);

  const items = [
    {
      key: "1",
      label: "업무",
      children: <Schedule mobile={mobile} user={user} />,
      disabled: !user
    },
    {
      key: "2",
      label: "캘린더",
      children: <CalendarPage mobile={mobile} user={user} />,
      disabled: !user
    },
    {
      key: "3",
      label: "마이페이지",
      children: <MyPage mobile={mobile} user={user} />
    }
  ];

  return (
    <div
      className={styles.page}
      style={{
        padding: mobile ? "20px 0px" : "64px"
      }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)} // 탭 변경을 관리
        type="card"
        size="large"
        items={items}
        style={{ fontFamily: "SUITE600" }}
        centered={mobile}
      />
    </div>
  );
}
