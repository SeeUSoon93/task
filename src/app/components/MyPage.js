import { Button, Card, Avatar } from "antd";
import { UserContext } from "../UserContext";
import { useContext } from "react";

export default function MyPage({ user }) {
  const { loginWithGoogle, logout } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <div style={{ padding: "0 20px" }}>
          <Card
            style={{
              fontFamily: "SUITE600",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              border: "none",
              position: "relative"
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Avatar
                  size={{
                    xs: 24,
                    sm: 32,
                    md: 40,
                    lg: 64,
                    xl: 80,
                    xxl: 100
                  }}
                  src={user.photoURL}
                />
              </div>
              <div style={{ marginLeft: "15px" }}>
                <h2>{user.displayName}님 환영합니다!</h2>
                <p>{user.email}</p>
              </div>
            </div>
            <div
              style={{ position: "absolute", bottom: "20px", right: "20px" }}
            >
              <Button
                onClick={logout}
                style={{
                  fontFamily: "SUITE600",
                  borderRadius: "15px",
                  fontSize: "16px"
                }}
              >
                로그아웃
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
          }}
        >
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
        </div>
      )}
    </div>
  );
}
