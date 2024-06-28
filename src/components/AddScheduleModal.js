import React from "react";
import { Modal, Form, Input, DatePicker, Button, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const AddScheduleModal = ({ visible, onCancel, onCreate, initialValues }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const { period, ...rest } = values;
    const formattedValues = {
      ...rest,
      period: period.map((date) => date.toDate()), // Moment.js 객체를 Date 객체로 변환
      requirements: values.requirements
        ? values.requirements.filter((req) => req.requirement)
        : [],
    };
    onCreate(formattedValues);
    form.resetFields();
  };

  return (
    <Modal
      title="일정 추가"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="period"
          label="날짜"
          rules={[{ required: true, message: "날짜를 선택하세요!" }]}
        >
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="content"
          label="내용"
          rules={[{ required: true, message: "내용을 입력하세요!" }]}
        >
          <Input.TextArea />
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
            추가
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: "8px" }}>
            취소
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddScheduleModal;
