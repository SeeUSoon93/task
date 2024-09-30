import { Button } from "antd";
import { FaPlus } from "react-icons/fa";
import TaskAddModal from "./modalComponents/TaskAddModal";
import { useState } from "react";

export default function ScheduleHeader({ handleTaskAdded, user }) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <h2>업무</h2>
      <Button
        icon={<FaPlus color="white" />}
        style={{
          marginLeft: "10px",
          borderRadius: "50%",
          border: "none",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.4)",
          background: "#70CACD"
        }}
        onClick={() => setVisible(true)}
      />
      <TaskAddModal
        visible={visible}
        setVisible={setVisible}
        handleTaskAdded={handleTaskAdded}
        user={user}
      />
    </div>
  );
}
