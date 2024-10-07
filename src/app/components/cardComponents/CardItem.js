import { useState, useEffect } from "react";
import { Card, Button, Modal, Badge } from "antd";
import CardDetail from "./CardDetail";
import { FaCheck } from "react-icons/fa";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 설정 가져오기
import { MdDeleteForever } from "react-icons/md";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function CardItem({ item, colorData, handleTaskDelete }) {
  const [isDone, setIsDone] = useState(item.isDone);
  const [percent, setPercent] = useState(item.percenter);
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    const today = new Date();
    const deadline = new Date(item.deadline);
    const diff = deadline - today; // 차이를 밀리초로 계산

    // 마감일이 3일 미만(밀리초로 계산)이고, 작업이 완료되지 않았을 경우
    if (diff < 3 * 24 * 60 * 60 * 1000 && !isDone) {
      setIsEmergency(true);
    } else {
      setIsEmergency(false); // 조건에 맞지 않으면 긴급 상태를 해제
    }
  }, [item.deadline, isDone]); // 마감일이나 완료 상태가 바뀔 때마다 실행

  // 삭제 확인 모달을 띄우는 함수
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "정말로 삭제하시겠습니까?",
      icon: <ExclamationCircleOutlined />,
      content: "이 작업을 삭제하면 되돌릴 수 없습니다.",
      okText: "확인",
      okType: "danger",
      cancelText: "취소",
      onOk() {
        handleDelete(); // 확인을 누르면 삭제 함수 호출
      },
      onCancel() {
        console.log("취소됨");
      }
    });
  };
  const toggleIsDone = async () => {
    const newIsDone = !isDone;
    setIsDone(newIsDone);
    const newPercent = newIsDone ? 100 : 0;
    setPercent(newPercent);

    try {
      const taskDocRef = doc(db, "task", item.id);
      await updateDoc(taskDocRef, { isDone: newIsDone });
      if (newIsDone) {
        await updateDoc(taskDocRef, { percenter: 100 });
        setPercent(100);
      } else {
        await updateDoc(taskDocRef, { percenter: 0 });
        setPercent(0);
      }
    } catch (error) {
      console.error("Error updating isDone in Firebase: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const taskDocRef = doc(db, "task", item.id);
      await deleteDoc(taskDocRef);
      handleTaskDelete(item.id);
    } catch (error) {
      console.error("Error deleting task in Firebase: ", error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // 내용 사이에 여백을 균등하게
        flex: "1 1 auto"
      }}
    >
      <Badge.Ribbon
        text={
          <div
            style={{
              display: "flex", // flex로 설정하여 가로, 세로 중앙 정렬
              justifyContent: "center", // 가로 중앙
              alignItems: "center", // 세로 중앙
              height: "100%" // 높이를 100%로 설정하여 중앙에 맞춤
            }}
          >
            마감 임박
          </div>
        }
        color="#FF004F"
        style={{
          marginTop: "48px",
          fontSize: "18px",
          fontFamily: "SUITE400",
          display: isEmergency ? "block" : "none",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
          height: "30px"
        }}
      >
        <Card
          style={{
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "15px",
            border: "none"
          }}
          extra={
            <div style={{ display: "flex", alignItems: "center" }}>
              <MdDeleteForever
                style={{
                  fontSize: "23px",
                  cursor: "pointer",
                  color: "#70CACD"
                }}
                onClick={showDeleteConfirm}
              />
            </div>
          }
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "25px",
                  height: "25px"
                }}
              >
                <Button
                  size="small"
                  icon={<FaCheck color={isDone ? "black" : "white"} />}
                  style={{
                    width: "25px",
                    height: "25px"
                  }}
                  onClick={toggleIsDone} // 클릭 시 상태 토글
                />
              </div>
              <h3 style={{ marginLeft: "10px" }}>{item.title}</h3>
            </div>
          }
        >
          <div style={{ flexGrow: 1 }}>
            <CardDetail
              item={item}
              colorData={colorData}
              isDone={isDone}
              setIsDone={setIsDone}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
              fontSize: "16px",
              fontFamily: "SUITE600"
            }}
          >
            <p style={{ color: "gray" }}>담당 연구원 : {item.researcher}</p>
          </div>
        </Card>
      </Badge.Ribbon>
    </div>
  );
}
