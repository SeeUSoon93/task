import { Button } from "antd";
import { FaPlus } from "react-icons/fa";

export default function ScheduleHeader() {
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
          background: "#70CACD",
        }}
      />
    </div>
  );
}
