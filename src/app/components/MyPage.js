import { UserContext } from "../UserContext";
import { useContext } from "react";
import UserInfo from "./myPageComponents/UserInfo";
import LoginButton from "./myPageComponents/LoginButton";

export default function MyPage({ user }) {
  const { loginWithGoogle, logout } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <div style={{ padding: "0 20px" }}>
          <UserInfo user={user} logout={logout} />
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
          <LoginButton loginWithGoogle={loginWithGoogle} />
        </div>
      )}
    </div>
  );
}
