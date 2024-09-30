import React, { createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userInfo = {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid
        };
        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo));
      } else {
        setUser(null);
        sessionStorage.removeItem("user");
      }
    });
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userInfo = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      };
      setUser(userInfo);
      sessionStorage.setItem("user", JSON.stringify(userInfo)); // 필요에 따라 sessionStorage에 저장
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      sessionStorage.removeItem("user");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </UserContext.Provider>
  );
};
