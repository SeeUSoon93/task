import styles from "./page.module.css";
import { Tabs } from "antd";
import Schedule from "./components/Schedule";

export default function Home() {
  const items = [
    { key: "1", label: "일정", Children: <Schedule /> },
    { key: "2", label: "캘린더" },
  ];
  return (
    <div className={styles.page}>
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="large"
        items={items}
        style={{ fontFamily: "SUITE600" }}
      />
    </div>
  );
}
