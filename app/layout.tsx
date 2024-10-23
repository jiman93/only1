"use client";
import { Group, Link, Toolbar, Text } from "react-aria-components";
import "./globals.css";
import { ReactQueryProvider } from "./react-query-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Function to read the current user from the cookie
const getCurrentUserFromCookie = () => {
  const cookies = document.cookie.split("; ");
  const userCookie = cookies.find((cookie) => cookie.startsWith("currentUser="));
  return userCookie ? decodeURIComponent(userCookie.split("=")[1]) : null;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const router = useRouter();
  const path = usePathname();

  // Check the currentUser from the cookie on every route change
  useEffect(() => {
    const user = getCurrentUserFromCookie();
    setCurrentUser(user);

    // Protect routes other than /login
    if (!user && path !== "/login") {
      router.push("/login"); // Redirect to login page
    }
  }, [path, router]);

  const handleLogout = () => {
    // Clear the currentUser cookie by setting it to expire
    document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setCurrentUser(null); // Clear state
    router.push("/login"); // Redirect to login page
  };

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Toolbar
            aria-label="Application Navigation Bar"
            className="flex bg-purple-600 text-white p-4"
          >
            <Group aria-label="Menu" className="flex space-x-4">
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
              <Link href="/access-management" className="hover:text-gray-300">
                Access Management
              </Link>
            </Group>
            <Group aria-label="Login" className="ml-auto flex space-x-4">
              {currentUser ? (
                <>
                  <Text>{currentUser}</Text>
                  <Link onPress={handleLogout} className="hover:text-gray-300">
                    Logout
                  </Link>
                </>
              ) : (
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
              )}
            </Group>
          </Toolbar>
          <Group className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            {children}
          </Group>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
