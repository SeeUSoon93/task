import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import "./css/Login.css";

const Login = ({ setLoggedIn }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    const { username, password } = values;
    const adminUsername = process.env.REACT_APP_ADMIN_USERNAME;
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      message.success("로그인 성공!");
      setLoggedIn(true);
    } else {
      message.error("아이디 또는 비밀번호가 잘못되었습니다.");
    }
    setLoading(false);
  };

  return (
    <Card
      style={{
        width: 300,
        margin: "100px auto",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Form name="login" onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "아이디를 입력해주세요!" }]}
          style={{ marginBottom: "16px" }}
        >
          <Input placeholder="아이디" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "비밀번호를 입력해주세요!" }]}
          style={{ marginBottom: "16px" }}
        >
          <Input.Password placeholder="비밀번호" />
        </Form.Item>
        <Form.Item style={{ marginBottom: "0" }}>
          <Button
            className="login-btn"
            htmlType="submit"
            loading={loading}
            block
            style={{ fontSize: "16px" }}
          >
            로그인
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
