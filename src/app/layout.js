"use client";

import "./globals.css";
import { MobileProvider, MobileContext } from "./MobileContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MobileProvider>{children}</MobileProvider>
      </body>
    </html>
  );
}
