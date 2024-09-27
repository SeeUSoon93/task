import React, { createContext, useState, useEffect } from "react";

export const MobileContext = createContext();

export function MobileProvider({ children }) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 실행

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <MobileContext.Provider value={{ mobile }}>
      {children}
    </MobileContext.Provider>
  );
}
