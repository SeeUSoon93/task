import {
  Modal,
  Form,
  Input,
  Divider,
  Select,
  DatePicker,
  Button,
  message
} from "antd";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore"; // Firestore 관련 함수 가져오기
import { db } from "../../firebase"; // Firebase 설정 가져오기

export default function TaskAddModal({ visible, setVisible, handleTaskAdded }) {
  const [form] = Form.useForm(); // Ant Design Form 사용
  const [loading, setLoading] = useState(false); // 저장 중 상태 관리

  // 저장 성공 시 알림
  const success = () => {
    message.success("업무가 성공적으로 추가되었습니다.");
  };

  // 저장 실패 시 알림
  const error = () => {
    message.error("업무 추가 중 오류가 발생했습니다.");
  };

  // 폼 제출 처리 함수
  const handleFinish = async (values) => {
    setLoading(true); // 저장 중 상태 활성화

    const { taskName, category, deadline, description, researcher } = values;

    try {
      // Firestore에 새 업무 추가
      const docRef = await addDoc(collection(db, "task"), {
        title: taskName,
        category: category,
        deadline: deadline.format("YYYY-MM-DD"), // DatePicker에서 선택한 날짜
        memo: description,
        researcher: researcher,
        isDone: false,
        percenter: 0
      });

      // 새로운 작업 객체 생성
      const newTask = {
        id: docRef.id,
        title: taskName,
        category: category,
        deadline: deadline.format("YYYY-MM-DD"),
        memo: description,
        researcher: researcher,
        isDone: false,
        percenter: 0
      };

      // 상위 컴포넌트에 새 작업 전달하여 상태 업데이트
      handleTaskAdded(newTask);

      success(); // 성공 알림
      form.resetFields(); // 폼 리셋
      setVisible(false); // 모달 닫기
    } catch (err) {
      console.error("Error adding task to Firestore: ", err);
      error(); // 실패 알림
    } finally {
      setLoading(false); // 저장 중 상태 비활성화
    }
  };

  // 취소 버튼 클릭 시 모달 닫기
  const handleCancel = () => {
    setVisible(false);
    form.resetFields(); // 폼 리셋
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null} // 기본 버튼 제거, 커스텀 버튼 추가
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontFamily: "SUITE600",
          fontSize: "20px"
        }}
      >
        <BiSolidMessageSquareAdd />
        <p style={{ marginLeft: "5px" }}>업무 추가하기</p>
      </div>
      <Divider />
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          name="taskName"
          rules={[{ required: true, message: "업무명을 입력해주세요." }]}
        >
          <Input addonBefore="업무명" size="large" />
        </Form.Item>
        <Form.Item
          name="category"
          rules={[{ required: true, message: "카테고리를 선택해주세요." }]}
        >
          <Select
            size="large"
            defaultValue="표지 디자인"
            options={[
              { value: "표지 디자인", label: "표지 디자인" },
              { value: "PPT 디자인", label: "PPT 디자인" },
              { value: "기타", label: "기타" }
            ]}
          />
        </Form.Item>
        <Form.Item
          name="deadline"
          rules={[{ required: true, message: "마감일을 선택해주세요." }]}
        >
          <DatePicker size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="description">
          <Input addonBefore="업무 내용" size="large" />
        </Form.Item>
        <Form.Item
          name="researcher"
          rules={[{ required: true, message: "담당 연구원을 입력해주세요." }]}
        >
          <Input addonBefore="담당 연구원" size="large" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading} // 저장 중이면 로딩 표시
            size="large"
            block
          >
            추가하기
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
