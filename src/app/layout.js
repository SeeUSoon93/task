"use client";

import "./globals.css";
import { MobileProvider, MobileContext } from "./MobileContext";
import { UserProvider } from "./UserContext";
import { useContext } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <MobileProvider>{children}</MobileProvider>
        </UserProvider>
      </body>
    </html>
  );
}
