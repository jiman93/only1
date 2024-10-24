"use client";

import { Group } from "react-aria-components";
import "./globals.css";
import { ReactQueryProvider } from "./react-query-provider";
import { Suspense } from "react";
import Navbar from "./navbar";
import { AppContextProvider } from "./context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AppContextProvider>
            <Navbar />
            <Group className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </Group>
          </AppContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
