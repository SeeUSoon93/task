import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import "./css/AddProjectModal.css"; // CSS 파일을 불러옵니다.

const { RangePicker } = DatePicker;
const { Option } = Select;

const AddProjectModal = ({ open, onCancel, onCreate, initialValues }) => {
  const [form] = Form.useForm();
  const [sum, setSum] = useState(0);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        period: initialValues.period.map((date) => moment(date.toDate())),
      });
      const { support, selfFund } = initialValues;
      setSum((support || 0) + (selfFund || 0));
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      period: values.period.map((date) => date.toDate()), // Moment.js 객체를 Date 객체로 변환
      requirements: values.requirements
        ? values.requirements.filter((req) => req.requirement)
        : [],
    };

    onCreate(formattedValues);
    form.resetFields();
  };

  const handleValuesChange = () => {
    const { support, selfFund } = form.getFieldsValue();
    setSum((support || 0) + (selfFund || 0));
  };

  return (
    <Modal
      title={initialValues ? "사업 수정" : "사업 추가"}
      open={open}
      onCancel={onCancel}
      footer={null}
      className="modal-title"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        className="modal-form"
      >
        <Form.Item
          name="title"
          label="사업 제목"
          rules={[{ required: true, message: "사업 제목을 입력하세요!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="agency"
          label="주관 기관"
          rules={[{ required: true, message: "주관 기관을 입력하세요!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="partner"
          label="협력 업체"
          rules={[{ required: true, message: "협력 업체를 입력하세요!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="period"
          label="수행 기간"
          rules={[{ required: true, message: "수행 기간을 선택하세요!" }]}
        >
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="support"
          label="지원금"
          rules={[{ required: true, message: "지원금을 입력하세요!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="selfFund"
          label="자부담금"
          rules={[{ required: true, message: "자부담금을 입력하세요!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="합계">
          <InputNumber value={sum} style={{ width: "100%" }} readOnly />
        </Form.Item>
        <Form.Item name="result" label="결과물">
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="현재 상태"
          rules={[{ required: true, message: "현재 상태를 선택하세요!" }]}
        >
          <Select style={{ width: "100%" }}>
            <Option value="지원">지원</Option>
            <Option value="선정">선정</Option>
            <Option value="협약">협약</Option>
            <Option value="착수">착수</Option>
            <Option value="진행">진행</Option>
            <Option value="중간보고">중간보고</Option>
            <Option value="결과보고">결과보고</Option>
            <Option value="완료">완료</Option>
          </Select>
        </Form.Item>
        <Form.List name="requirements">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row key={key} gutter={8} align="middle">
                  <Col flex="auto">
                    <Form.Item
                      {...restField}
                      name={[name, "requirement"]}
                      fieldKey={[fieldKey, "requirement"]}
                      rules={[
                        { required: true, message: "필요사항을 입력하세요" },
                      ]}
                    >
                      <Input placeholder="필요사항" />
                    </Form.Item>
                  </Col>
                  <Col flex="none">
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  필요사항 추가
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialValues ? "수정" : "추가"}
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: "8px" }}>
            취소
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
