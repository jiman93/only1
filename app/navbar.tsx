"use client";

import { Group, Link, Toolbar, Text } from "react-aria-components";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch the current user from the API endpoint
const fetchCurrentUser = async () => {
  const response = await fetch("/api/users/currentUser");
  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  return response.json();
};

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
  const queryClient = useQueryClient(); // Access the React Query Client

  // Use useQuery to fetch the current user data
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    enabled: path !== "/login" && path !== "/users", // Fetch only if not on login or users page
  });

  const handleLogout = () => {
    // Clear the currentUser cookie by setting it to expire
    document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Invalidate or remove the currentUser data from React Query's cache
    queryClient.removeQueries({ queryKey: ["currentUser"] }); // Clears the currentUser data from cache

    router.push("/login"); // Redirect to login page
  };

  return (
    <Toolbar aria-label="Application Navigation Bar" className="flex bg-purple-600 text-white p-4">
      <Group aria-label="Menu" className="flex space-x-4">
        <Link href="/users" className="hover:text-gray-300">
          Users
        </Link>
        <Link href="/access-management" className="hover:text-gray-300">
          Access Management
        </Link>
      </Group>
      <Group aria-label="Login" className="ml-auto flex space-x-4">
        {currentUser ? (
          <>
            <Text>{currentUser.name}</Text> {/* Display the user's name */}
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
  );
};

export default Navbar;
