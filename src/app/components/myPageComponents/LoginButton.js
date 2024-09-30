import { Button } from "antd";

export default function LoginButton({ loginWithGoogle }) {
  return (
    <Button
      onClick={loginWithGoogle} // 구글 로그인 함수 실행
      style={{
        fontFamily: "SUITE600",
        borderRadius: "15px",
        fontSize: "16px"
      }}
    >
      구글 로그인
    </Button>
  );
}
