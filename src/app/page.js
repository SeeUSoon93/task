"use client";

import styles from "./page.module.css";
import { Tabs } from "antd";
import Schedule from "./components/Schedule";
import CalendarPage from "./components/CalendarPage";
import { MobileContext } from "./MobileContext";
import { useContext } from "react";

export default function Home() {
  const { mobile } = useContext(MobileContext);

  const items = [
    { key: "1", label: "업무", children: <Schedule /> },
    { key: "2", label: "캘린더", children: <CalendarPage mobile={mobile} /> }
  ];
  return (
    <div
      className={styles.page}
      style={{
        padding: mobile ? "20px 0px" : "64px"
      }}
    >
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="large"
        items={items}
        style={{ fontFamily: "SUITE600" }}
        centered={mobile}
      />
    </div>
  );
}
